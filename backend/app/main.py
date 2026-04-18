import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Nafas AI Wellness Backend")

# 1. Update Origins to include your NEW Vercel URL
origins = [
    "http://localhost:3000",
    "https://nafas-orpin.vercel.app",
    "https://nafas-beige.vercel.app",  # Added your active URL
    "https://nafas-git-main-allan0s-projects.vercel.app",
    "*" # Temporary: allow all while debugging
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Use "*" for now to stop CORS errors during testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "core_data", "wellness_knowledge.json")

def load_knowledge():
    try:
        if os.path.exists(DATA_PATH):
            with open(DATA_PATH, "r") as f:
                return json.load(f)
        return {}
    except Exception:
        return {}

class UserQuery(BaseModel):
    goal: str
    location: Optional[str] = "Dubai"

@app.get("/")
def read_root():
    return {"status": "Nafas API Online"}

# ENSURE THIS PATH IS EXACTLY "/recommend"
@app.post("/recommend")
async def get_recommendations(query: UserQuery):
    data = load_knowledge()
    goal = query.goal.lower()
    
    # Logic... (keep your existing matching logic here)
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
        res = [{"secret": "Nafas Awareness", "detail": "Take a deep breath."}]

    return {"status": "success", "recommendations": res}

@app.get("/nearby")
def get_nearby():
    return {"spots": [{"name": "Kite Beach Yoga", "activity": "Yoga"}]}
