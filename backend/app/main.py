from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uvicorn
import logging
import random
from datetime import datetime

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("NafasBackend")

app = FastAPI(
    title="Nafas (نفس) API",
    description="AI-Driven Wellness & SocialFi Engine for the UAE",
    version="1.0.0"
)

# Production CORS Configuration
# In production, replace ["*"] with your actual Vercel domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SCHEMAS (Data Models) ---

class UserProfile(BaseModel):
    userId: Optional[str] = "anon_user"
    goal: str = Field(..., example="yoga", description="Main wellness focus")
    location: str = Field("Dubai", example="Abu Dhabi")
    experience_level: str = Field("beginner", example="intermediate")
    current_temp: Optional[float] = 35.0

class RecommendationResponse(BaseModel):
    category: str
    title: str
    action_plan: str
    uae_location_tip: str
    token_reward_estimate: int
    environmental_advice: str
    timestamp: str

# --- MOCK KNOWLEDGE BASE (In production, this moves to Vector DB/PostgreSQL) ---

WELLNESS_DB = {
    "yoga": {
        "title": "Hatha Flow for Heat Adaptation",
        "plan": "Focus on Sitali (cooling breath) and slow transitions. 20-minute flow focusing on hip openers.",
        "spots": ["Kite Beach (Early Morning)", "Yoga House (Al Barsha)", "Saadiyat Beach"],
        "reward": 40
    },
    "endurance": {
        "title": "Zone 2 Metabolic Conditioning",
        "plan": "Maintain 65-75% max heart rate. Focus on nasal breathing to regulate core temperature.",
        "spots": ["Al Qudra Cycle Track", "NAS Sports Complex", "Hudayriyat Island"],
        "reward": 60
    },
    "smoking_cessation": {
        "title": "Neuro-Pathway Redirection",
        "plan": "Whenever a craving hits, perform 2 minutes of 'Box Breathing'. Replace nicotine dopamine with exercise-induced endorphins.",
        "spots": ["Any peaceful park - Al Safa Park recommended"],
        "reward": 100
    },
    "dental": {
        "title": "Holistic Oral Care",
        "plan": "Morning Oil Pulling followed by non-fluoride mineralizing paste. Increases mouth alkalinity.",
        "spots": ["Home practice"],
        "reward": 20
    }
}

# --- ENDPOINTS ---

@app.get("/")
async def health_check():
    return {
        "status": "active",
        "engine": "Nafas AI v1",
        "server_time": datetime.now().isoformat(),
        "region": "me-central-1"
    }

@app.post("/api/v1/recommend", response_model=RecommendationResponse)
async def get_wellness_recommendation(profile: UserProfile):
    """
    AI Logic: Analyzes user goals and environmental factors to 
    provide a UAE-specific wellness plan.
    """
    logger.info(f"Generating recommendation for user {profile.userId} focusing on {profile.goal}")
    
    goal_key = profile.goal.lower()
    
    # Matching Logic (Simulating RAG/AI Search)
    category_data = None
    for key in WELLNESS_DB:
        if key in goal_key:
            category_data = WELLNESS_DB[key]
            category_name = key.capitalize()
            break
            
    if not category_data:
        raise HTTPException(
            status_code=404, 
            detail="Goal not yet mapped in our UAE Knowledge Base. Try 'Yoga' or 'Running'."
        )

    # Environmental Logic (UAE Specific)
    env_advice = "Stay hydrated."
    if profile.current_temp and profile.current_temp > 38:
        env_advice = "Extreme Heat Warning: Move session indoors to a climate-controlled facility like Dubai Ladies Club or NAS."
    elif 30 <= (profile.current_temp or 0) <= 38:
        env_advice = "High Humidity: Focus on electrolyte replenishment (Sodium/Potassium/Magnesium)."

    return RecommendationResponse(
        category=category_name,
        title=category_data["title"],
        action_plan=category_data["plan"],
        uae_location_tip=random.choice(category_data["spots"]),
        token_reward_estimate=category_data["reward"],
        environmental_advice=env_advice,
        timestamp=datetime.now().isoformat()
    )

@app.get("/api/v1/social/feed")
async def get_social_feed():
    """
    Simulated SocialFi Feed: In production, this pulls from a DB
    """
    return [
        {"id": 1, "user": "Salma_DXB", "text": "Just finished sunrise yoga at Jumeirah! 🧘‍♀️", "tips": 450},
        {"id": 2, "user": "Ahmed_Runner", "text": "Al Qudra 50km loop done. VO2 Max improving! 🚴‍♂️", "tips": 1200},
        {"id": 3, "user": "WellnessWarrior", "text": "Day 15: No smoking. Feeling the Nafas. 💨", "tips": 890},
    ]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
