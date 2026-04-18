import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# FULL PERMISSIVE CORS FOR DEBUGGING
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Integrated Material Knowledge (Hardcoded to prevent 404/File errors)
KNOWLEDGE = {
    "yoga": [{"pose": "Sitali Pranayama", "secret": "Cooling Breath", "detail": "Curling tongue to lower body temp."}],
    "endurance": [{"topic": "Running", "secret": "2:2 Rhythm", "detail": "Sync breath with steps."}],
    "smoking_cessation": [{"tactic": "Box Breath", "detail": "4-4-4-4 rhythm to stop cravings."}],
    "dental_hygiene": [{"topic": "Dental", "secret": "Alkaline Rinsing", "detail": "Salt water after dates."}]
}

class UserQuery(BaseModel):
    goal: str
    location: str = "Dubai"

@app.post("/recommend")
async def recommend(query: UserQuery):
    goal = query.goal.lower()
    if "yoga" in goal: res = KNOWLEDGE["yoga"]
    elif "run" in goal or "endurance" in goal: res = KNOWLEDGE["endurance"]
    elif "smoke" in goal: res = KNOWLEDGE["smoking_cessation"]
    elif "teeth" in goal or "dental" in goal: res = KNOWLEDGE["dental_hygiene"]
    else: res = [{"secret": "Nafas", "detail": "Take a deep breath."}]
    return {"status": "success", "recommendations": res}

@app.get("/")
async def health():
    return {"status": "Nafas API Online"}

@app.get("/nearby")
async def nearby():
    return {"spots": [{"name": "Kite Beach Yoga", "activity": "Yoga"}]}
