import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Try to import AI logic safely
try:
    from core.ai_logic import NafasProAI
    nafas_ai = NafasProAI()
    print("✅ NafasProAI initialized successfully")
except Exception as e:
    nafas_ai = None
    print(f"⚠️ AI initialization failed: {e}. Running in fallback mode.")

# Load core data
def load_core_data():
    data = {"activities": []}
    base_path = os.path.join(os.path.dirname(__file__), "core_data")
    
    files = ["wellness_knowledge.json", "endurance_secrets.json", "dental_wellness.json"]
    for filename in files:
        try:
            with open(os.path.join(base_path, filename), "r", encoding="utf-8") as f:
                content = json.load(f)
                # Simple flattening for now
                if isinstance(content, dict) and "yoga" in content:
                    for item in content.get("yoga", []):
                        data["activities"].append({
                            "id": f"yoga-{len(data['activities'])}",
                            "title": item.get("pose", "Yoga Pose"),
                            "category": "Yoga",
                            "tokens": 30,
                            "duration": "8 min",
                            "difficulty": "Easy",
                            "detail": item.get("benefit", ""),
                            "uae_context": item.get("uae_context", "")
                        })
                elif isinstance(content, list):
                    for item in content:
                        data["activities"].append({
                            "id": f"item-{len(data['activities'])}",
                            "title": item.get("topic", item.get("pose", "Activity")),
                            "category": "Wellness",
                            "tokens": 50,
                            "duration": "15 min",
                            "difficulty": "Medium",
                            "detail": item.get("detail", item.get("secret", "")),
                            "uae_context": item.get("uae_context", "UAE friendly")
                        })
        except Exception as e:
            print(f"Warning loading {filename}: {e}")

    if not data["activities"]:
        data["activities"] = [{
            "id": "fallback-1",
            "title": "Box Breathing",
            "category": "Yoga",
            "tokens": 20,
            "duration": "5 min",
            "difficulty": "Easy",
            "detail": "4-7-8 breathing technique",
            "uae_context": "Perfect for hot weather"
        }]
    return data

CORE_ACTIVITIES = load_core_data()

class UserQuery(BaseModel):
    goal: str
    location: str = "Dubai"

class MintRequest(BaseModel):
    activity_id: str
    amount: int
    wallet_address: str

app = FastAPI(title="Nafas Wellness API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/recommend")
async def recommend(query: UserQuery):
    if nafas_ai:
        try:
            temp = 33
            humidity = 60
            ai_json_str = nafas_ai.generate_smart_recommendation(query.goal, temp, humidity)
            parsed = json.loads(ai_json_str)
            return {
                "status": "success",
                "recommendations": [{
                    "topic": parsed.get("title", "Recommendation"),
                    "detail": parsed.get("plan", ""),
                    "benefit": parsed.get("safety_tip", "")
                }],
                "ai_mode": True
            }
        except:
            pass

    # Fallback
    return {"status": "success", "recommendations": [{"detail": "Take a deep breath and stay consistent."}], "ai_mode": False}

@app.get("/activities")
async def get_activities():
    return {"status": "success", "activities": CORE_ACTIVITIES["activities"]}

@app.post("/mint")
async def mint_naf(request: MintRequest):
    if not request.wallet_address or len(request.wallet_address) < 10:
        raise HTTPException(400, "Invalid wallet address")
    
    print(f"Minting {request.amount} $NAF for activity {request.activity_id} to {request.wallet_address}")
    
    return {
        "status": "success",
        "message": f"Minted {request.amount} $NAF",
        "activity_id": request.activity_id,
        "wallet": request.wallet_address
    }

@app.get("/")
async def health():
    return {
        "status": "Nafas API Online",
        "ai_ready": nafas_ai is not None,
        "activities_count": len(CORE_ACTIVITIES["activities"])
    }
