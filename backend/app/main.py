import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# FULL PERMISSIVE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hardcoded material base
KNOWLEDGE = {
    "yoga": [{"pose": "Sitali Pranayama", "secret": "Cooling Breath", "detail": "Curling tongue to lower body temp."}],
    "endurance": [{"topic": "Running", "secret": "2:2 Rhythm", "detail": "Sync breath with steps."}],
    "smoking_cessation": [{"tactic": "Box Breath", "detail": "4-4-4-4 rhythm to stop cravings."}],
    "dental_hygiene": [{"topic": "Dental", "secret": "Alkaline Rinsing", "detail": "Salt water after dates."}]
}

class UserQuery(BaseModel):
    goal: str
    location: str = "Dubai"

# Ensure root returns status
@app.get("/")
async def health():
    return {"status": "Nafas API Online"}

# NEW: Robust nearby endpoint
@app.get("/nearby")
async def nearby():
    return {
        "spots": [
            {"name": "Kite Beach Yoga", "lat": 25.164, "lng": 55.201, "activity": "Yoga"},
            {"name": "Al Qudra Cycle Track", "lat": 24.83, "lng": 55.37, "activity": "Cycling"},
            {"name": "JBR Beach Run", "lat": 25.07, "lng": 55.13, "activity": "Running"}
        ]
    }

@app.post("/recommend")
async def recommend(query: UserQuery):
    goal = query.goal.lower()
    if "yoga" in goal: res = KNOWLEDGE["yoga"]
    elif "run" in goal or "endurance" in goal: res = KNOWLEDGE["endurance"]
    elif "smoke" in goal: res = KNOWLEDGE["smoking_cessation"]
    else: res = [{"secret": "Nafas", "detail": "Take a deep breath."}]
    return {"status": "success", "recommendations": res}
