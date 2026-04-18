from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os

app = FastAPI(title="Nafas AI Wellness Backend")

# Enable CORS so your Vercel frontend can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set path to the knowledge base
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "core_data/wellness_knowledge.json")

def load_knowledge():
    if not os.path.exists(DATA_PATH):
        return {}
    with open(DATA_PATH, "r") as f:
        return json.load(f)

class UserQuery(BaseModel):
    goal: str
    location: str = "Dubai"

@app.get("/")
def home():
    return {"status": "Nafas API Online", "region": "UAE"}

@app.post("/recommend")
async def get_recommendations(query: UserQuery):
    data = load_knowledge()
    goal = query.goal.lower()
    
    # Matching Logic
    if "yoga" in goal:
        res = data.get("yoga", [])
    elif "run" in goal or "endurance" in goal:
        res = data.get("endurance", [])
    elif "smoke" in goal or "quit" in goal:
        res = data.get("smoking_cessation", [])
    elif "teeth" in goal or "dental" in goal:
        res = data.get("dental_hygiene", [])
    elif "fat" in goal or "weight" in goal:
        res = data.get("fat_reduction", [])
    elif "meal" in goal or "food" in goal:
        res = data.get("meal_plans", [])
    else:
        return {
            "category": "General", 
            "recommendations": [{"secret": "Deep Breathing", "detail": "Take 10 deep breaths today."}]
        }

    return {"status": "success", "category": goal, "recommendations": res}

@app.get("/nearby")
def get_nearby():
    # UAE landmarks/wellness spots
    return {
        "spots": [
            {"name": "Kite Beach Yoga", "lat": 25.164, "lng": 55.201, "activity": "Yoga"},
            {"name": "Al Qudra Cycle Track", "lat": 24.83, "lng": 55.37, "activity": "Endurance"},
            {"name": "JBR Beach Run", "lat": 25.07, "lng": 55.13, "activity": "Running"}
        ]
    }
