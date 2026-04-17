from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os

app = FastAPI(title="Nafas Wellness AI")

# Load our material
DATA_PATH = os.path.join(os.path.dirname(__file__), "core_data/wellness_knowledge.json")

def get_knowledge():
    with open(DATA_PATH, "r") as f:
        return json.load(f)

class UserProfile(BaseModel):
    goal: str  # e.g., "yoga", "endurance", "smoking"
    location: str = "Dubai"

@app.get("/")
def read_root():
    return {"status": "Nafas API Active", "location": "UAE"}

@app.post("/recommend")
async def recommend(profile: UserProfile):
    data = get_knowledge()
    goal = profile.goal.lower()
    
    # Simple Logic: Match goal to knowledge category
    if "yoga" in goal:
        return {"category": "Yoga", "content": data["yoga"]}
    elif "run" in goal or "endurance" in goal:
        return {"category": "Endurance", "content": data["endurance"]}
    elif "smoke" in goal or "quit" in goal:
        return {"category": "Smoking Cessation", "content": data["smoking_cessation"]}
    elif "teeth" in goal or "dental" in goal:
        return {"category": "Dental Hygiene", "content": data["dental"]}
    else:
        raise HTTPException(status_code=404, detail="Goal not found in knowledge base. Try 'yoga' or 'running'.")
