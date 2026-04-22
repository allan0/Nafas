import os
import json
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.core.ai_logic import NafasProAI

app = FastAPI(title="Nafas Protocol AI Node - DXB-01")

# Initialize the Neural Engine
ai_engine = NafasProAI()

# --- CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATA MODELS FOR NEURAL INDEXING ---

class ActivityLog(BaseModel):
    type: str
    title: str
    xp: int
    date: str
    value: Optional[str] = None

class HabitStats(BaseModel):
    dailyWater: int
    dailyCigs: int
    fruitHabit: int

class UserProfile(BaseModel):
    bodyType: Optional[str] = "Not specified"
    weight: Optional[str] = "70"
    height: Optional[str] = "170"
    ethnicity: Optional[str] = "Global"
    age: Optional[str] = "30"

class UserQuery(BaseModel):
    goal: str
    profile: UserProfile
    habits: HabitStats
    history: List[ActivityLog]
    location: str = "Dubai"

# --- UTILS ---

def get_uae_weather(location: str):
    """
    In production, this would call an API. 
    Currently returns typical UAE summer/shoulder season values.
    """
    return {"temp": 38.5, "humidity": 65}

# --- API ROUTES ---

@app.get("/health")
async def health_check():
    return {
        "status": "Protocol Online",
        "neural_engine": "Ready",
        "node": "UAE-DXB-01"
    }

@app.post("/recommend")
async def ai_recommender(query: UserQuery):
    """
    The main processing node. 
    Converts user identity and behavior into a specific wellness protocol.
    """
    try:
        # 1. Get Environmental Context
        weather = get_uae_weather(query.location)
        
        # 2. Extract and sanitize history for AI (Limit to last 10 for token efficiency)
        history_list = [h.dict() for h in query.history[-10:]]
        
        # 3. Call the Logic Engine
        # This performs the RAG search and the Bio-Contextual Analysis
        raw_ai_response = ai_engine.generate_smart_recommendation(
            goal=query.goal,
            temp=weather["temp"],
            humidity=weather["humidity"],
            user_profile=query.profile.dict(),
            habits=query.habits.dict(),
            activity_history=history_list
        )

        # 4. Parse JSON string from AI into a dict
        structured_response = json.loads(raw_ai_response)
        
        return {
            "status": "success",
            "data": structured_response,
            "meta": {
                "weather_context": weather,
                "node": "UAE-DXB-01"
            }
        }

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI produced malformed protocol data.")
    except Exception as e:
        print(f"Error in recommendation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/nearby")
async def get_nearby_hubs():
    """Returns official UAE wellness points for GPS mapping."""
    return {
        "spots": [
            {"name": "Kite Beach Courts", "lat": 25.164, "lng": 55.201, "activity": "Beach/Sports"},
            {"name": "Marina Walk Loop", "lat": 25.068, "lng": 55.130, "activity": "Running/Walk"},
            {"name": "Al Qudra Cycle Hub", "lat": 24.830, "lng": 55.376, "activity": "Endurance"},
            {"name": "Mushrif Forest", "lat": 25.215, "lng": 55.454, "activity": "Walking"},
            {"name": "Hamdan Sports Center", "lat": 25.043, "lng": 55.312, "activity": "Swimming"},
            {"name": "JBR Outdoor Crossfit", "lat": 25.071, "lng": 55.135, "activity": "Fitness"}
        ]
    }
