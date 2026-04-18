import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Nafas AI Wellness Backend")

# Security: Allow your Vercel URL to access this API
origins = [
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", "*"),
    "https://nafas-orpin.vercel.app",
    "https://nafas-git-main-allan0s-projects.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Knowledge Base
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "core_data/wellness_knowledge.json")

def load_knowledge():
    try:
        with open(DATA_PATH, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return {}

# Data Models
class UserQuery(BaseModel):
    goal: str
    location: Optional[str] = "Dubai"

@app.get("/")
def read_root():
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
    else:
        res = [{"secret": "Nafas Awareness", "detail": "Focus on 5 deep breaths while I find better data for you."}]

    return {"status": "success", "category": goal, "recommendations": res}

@app.get("/nearby")
def get_nearby():
    return {
        "spots": [
            {"name": "Kite Beach Yoga", "lat": 25.164, "lng": 55.201, "activity": "Yoga"},
            {"name": "Al Qudra Cycle Track", "lat": 24.83, "lng": 55.37, "activity": "Endurance"},
            {"name": "JBR Beach Run", "lat": 25.07, "lng": 55.13, "activity": "Running"}
        ]
    }
