import os
from pinecone import Pinecone
from openai import OpenAI
from langchain_core.prompts import ChatPromptTemplate
from typing import Dict, Any, List

class NafasProAI:
    def __init__(self):
        # Initialize Clients
        self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.index_name = "nafas-knowledge-base"
        
        # Connect to vector index
        # Note: Ensure your local JSON/PDF data is indexed here for RAG to work
        try:
            self.index = self.pc.Index(self.index_name)
        except Exception as e:
            print(f"Pinecone Connection Warning: {e}")
            self.index = None

    def generate_smart_recommendation(
        self, 
        goal: str, 
        temp: float, 
        humidity: int, 
        user_profile: Dict[str, Any],
        habits: Dict[str, Any],
        activity_history: List[Dict[str, Any]]
    ):
        """
        Generates a hyper-personalized response by cross-referencing:
        1. RAG (Expert Knowledge)
        2. User Bio-Identity (Height/Weight/Ethnicity)
        3. Real-time Habits (Smoking/Water)
        4. Historical Activity (XP/Consistency)
        """

        # 1. Vector Search for Expert Context
        query_vec = self.openai_client.embeddings.create(
            input=f"{goal} {user_profile.get('ethnicity', '')}",
            model="text-embedding-3-small"
        ).data[0].embedding

        context = ""
        if self.index:
            search_results = self.index.query(
                vector=query_vec,
                top_k=3,
                include_metadata=True
            )
            for match in search_results['matches']:
                context += match['metadata']['text'] + "\n"

        # 2. Construct the Clinical/Neural Prompt
        prompt = ChatPromptTemplate.from_template("""
            You are the Nafas Neural Wellness Engine. You analyze users' biological and behavioral data to provide precision wellness protocols.

            --- EXPERT KNOWLEDGE BASE ---
            {context}

            --- USER BIO-IDENTITY ---
            - Morphology: {bodyType}
            - Metrics: {height}cm, {weight}kg
            - Ethnicity: {ethnicity}
            - Risk Factor: {smokingHabit} cigarettes/day current avg

            --- DAILY HABITS & HISTORY ---
            - Hydration: {water} glasses today
            - Recent Activities: {history_summary}

            --- ENVIRONMENTAL CONTEXT (UAE) ---
            - Current Weather: {temp}°C, {humidity}% Humidity
            
            --- TASK ---
            The user's query is: "{goal}"
            
            Strictly follow this logic:
            1. BIO-ANALYSIS: Analyze how their morphology and ethnicity might affect their response to {goal}.
            2. HABIT PENALTY/BOOST: If smoking is high (>5), prioritize respiratory-focused advice. If water is low (<5), emphasize hydration before the protocol.
            3. UAE ADAPTATION: If temp > 35°C, suggest indoor alternatives or specific cooling techniques like Sitali Pranayama.
            4. LOCATION: Recommend a specific UAE location (e.g. Al Qudra for endurance, Kite Beach for yoga).

            FORMAT: Return a JSON object with:
            {{
                "analysis": "Brief bio-contextual reasoning",
                "title": "Protocol Title",
                "plan": "Step-by-step instructions",
                "safety_tip": "Specific warning based on their habits/weather",
                "uae_location": "Recommended spot in UAE",
                "redirect_hint": "yoga" | "run" | "breath" | "weight_loss"
            }}
        """)

        # 3. Format history for the AI
        history_summary = ", ".join([h.get('title', '') for h in activity_history[-5:]])

        formatted_prompt = prompt.format(
            context=context if context else "Standard wellness and UAE health guidelines.",
            goal=goal,
            temp=temp,
            humidity=humidity,
            bodyType=user_profile.get('bodyType', 'Not specified'),
            height=user_profile.get('height', '--'),
            weight=user_profile.get('weight', '--'),
            ethnicity=user_profile.get('ethnicity', 'Global'),
            smokingHabit=habits.get('dailyCigs', 0),
            water=habits.get('dailyWater', 0),
            history_summary=history_summary if history_summary else "No recent data"
        )

        # 4. Generate AI Response
        response = self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a professional medical wellness AI for the UAE market."},
                {"role": "user", "content": formatted_prompt}
            ],
            response_format={ "type": "json_object" }
        )

        return response.choices[0].message.content
