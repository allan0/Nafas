import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict

app = FastAPI(title="Nafas Protocol AI Node")

# --- CORS CONFIGURATION ---
# Allows your Vercel frontend and Telegram environment to communicate securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- PROTOCOL KNOWLEDGE BASE (Simulated RAG) ---
# High-fidelity UAE-specific wellness secrets indexed by category
KNOWLEDGE_BASE = {
    "yoga": {
        "material": "Sitali Pranayama (Cooling Breath) & Vrikshasana (Grounding).",
        "redirect": "yoga",
        "secrets": [
            "UAE Secret: Practice Sitali by curling the tongue to lower core temperature during high-humidity months.",
            "Pose Logic: Tree pose (Vrikshasana) resets the vestibular system after long desert commutes."
        ]
    },
    "smoking": {
        "material": "Box Breathing (4-4-4-4) Vagus Nerve Stimulation.",
        "redirect": "breath",
        "secrets": [
            "The Haptic Hit: Cravings peak at 3 minutes. Mimic the deep inhalation of smoking with O2 to release dopamine naturally.",
            "Protocol: When the urge hits, perform 5 cycles of Box Breath to stabilize heart rate variability."
        ]
    },
    "endurance": {
        "material": "Zone 2 Maffetone Training (Heart Rate = 180 - Age).",
        "redirect": "run",
        "secrets": [
            "Mitochondrial Density: Running in UAE heat requires a lower aerobic ceiling to prevent oxidative stress.",
            "Breath Sync: Use the 2:2 rhythm (2 steps inhale, 2 steps exhale) to prevent diaphragm cramping."
        ]
    },
    "weight_loss": {
        "material": "Circadian Fasting & Thermogenic Spices.",
        "redirect": "walk",
        "secrets": [
            "Local Hack: Add fresh Ginger and Turmeric to Arabic coffee to boost thermogenesis in sedentary office environments.",
            "Window: Align meal times with local sunlight cycles to reset insulin sensitivity."
        ]
    }
}

# --- DATA MODELS ---
class UserProfile(BaseModel):
    bodyType: Optional[str] = ""
    weight: Optional[str] = ""
    height: Optional[str] = ""
    ethnicity: Optional[str] = ""
    smokingHabit: Optional[int] = 0

class UserQuery(BaseModel):
    goal: str
    location: str = "Dubai"
    profile: Optional[UserProfile] = None

# --- API ROUTES ---

@app.get("/")
@app.get("/health")
async def health_check():
    return {"status": "Protocol Online", "node": "UAE-DXB-01"}

@app.get("/nearby")
@app.get("/nearby/")
async def get_nearby_hubs():
    """Returns real UAE wellness and recreation centers for GPS filtering."""
    return {
        "spots": [
            {"name": "Kite Beach Courts", "lat": 25.164, "lng": 55.201, "activity": "Beach/Sports"},
            {"name": "Marina Walk Loop", "lat": 25.068, "lng": 55.130, "activity": "Running/Walk"},
            {"name": "Al Qudra Cycle Hub", "lat": 24.830, "lng": 55.376, "activity": "Endurance"},
            {"name": "Mushrif Forest", "lat": 25.215, "lng": 55.454, "activity": "Walking"},
            {"name": "Hamdan Sports Center", "lat": 25.043, "lng": 55.312, "activity": "Swimming"},
            {"name": "JBR Outdoor Crossfit", "lat": 25.071, "lng": 55.135, "activity": "Fitness"},
            {"name": "Skydive Dubai Track", "lat": 25.091, "lng": 55.138, "activity": "Sprints"}
        ]
    }

@app.post("/recommend")
async def ai_recommender(query: UserQuery):
    """The brain of the system. Processes goals based on physical bio-identity."""
    goal = query.goal.lower()
    profile = query.profile
    
    # Matching Engine
    category = None
    if any(word in goal for word in ["yoga", "stretch", "flexible"]): category = "yoga"
    elif any(word in goal for word in ["smoke", "quit", "cigar"]): category = "smoking"
    elif any(word in goal for word in ["run", "race", "endurance"]): category = "endurance"
    elif any(word in goal for word in ["fat", "weight", "diet", "meal"]): category = "weight_loss"

    if category:
        base = KNOWLEDGE_BASE[category]
        advice = base["secrets"]
        
        # Tailor advice based on Profile
        p_context = ""
        if profile:
            if profile.smokingHabit > 10 and category == "endurance":
                p_context = "CRITICAL: Given your high combustion levels, focus exclusively on Nasal Breathing to protect lung tissue."
            elif profile.bodyType == "Endomorph" and category == "weight_loss":
                p_context = "Bio-Note: Your morphology responds best to fasted morning walks before the 10AM heat peak."

        return {
            "status": "success",
            "recommendations": [{
                "title": base["material"],
                "detail": f"{p_context} {advice[0]}",
                "benefit": advice[1]
            }],
            "redirect_hint": base["redirect"] # Tells frontend which tab to highlight
        }
    
    return {
        "status": "success",
        "recommendations": [{
            "title": "Protocol Neutral",
            "detail": "Nafas AI is indexing your specific query. For now, focus on conscious hydration.",
            "benefit": "Consistency is the primary mining metric."
        }],
        "redirect_hint": None
    }
