import os
from pinecone import Pinecone
from openai import OpenAI
from langchain_core.prompts import ChatPromptTemplate
from typing import Dict, Any

class NafasProAI:
    def __init__(self):
        # Initialize Clients using your requirements
        self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        self.openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.index_name = "nafas-knowledge-base"
        
        # Connect to your vector index
        self.index = self.pc.Index(self.index_name)

    def generate_smart_recommendation(self, goal: str, temp: float, humidity: int):
        # 1. Vector Search: Find the most relevant wellness data in Pinecone
        # We embed the user's goal to find matching expert documents
        query_vec = self.openai_client.embeddings.create(
            input=goal,
            model="text-embedding-3-small"
        ).data[0].embedding

        search_results = self.index.query(
            vector=query_vec,
            top_k=2,
            include_metadata=True
        )

        # Extract context from your uploaded PDF/Docs in Pinecone
        context = ""
        for match in search_results['matches']:
            context += match['metadata']['text'] + "\n"

        # 2. Build the UAE-Aware Prompt
        prompt = ChatPromptTemplate.from_template("""
            You are the Nafas AI Wellness Coach, an expert in UAE-specific health.
            
            CONTEXT FROM KNOWLEDGE BASE:
            {context}
            
            USER GOAL: {goal}
            CURRENT UAE WEATHER: {temp}°C, {humidity}% Humidity
            
            INSTRUCTIONS:
            1. Provide a specific exercise plan based on the context.
            2. Adjust the advice for the UAE weather (Heat/Humidity).
            3. Mention a specific location in the UAE (e.g., Kite Beach, Al Qudra, Mushrif Park).
            4. Keep the tone professional, encouraging, and scientific.
            
            FORMAT: Return a JSON-style response with 'title', 'plan', and 'safety_tip'.
        """)

        # 3. Generate Response using OpenAI
        formatted_prompt = prompt.format(
            context=context if context else "General wellness guidelines",
            goal=goal,
            temp=temp,
            humidity=humidity
        )

        response = self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": formatted_prompt}],
            response_format={ "type": "json_object" }
        )

        return response.choices[0].message.content
