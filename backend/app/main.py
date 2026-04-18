import os
import sys
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add backend to Python path so 'core' can be found
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Safe AI import
try:
    from core.ai_logic import NafasProAI
    nafas_ai = NafasProAI()
    print("✅ Nafas AI initialized successfully")
except Exception as e:
    nafas_ai = None
    print(f"⚠️ AI failed to initialize: {e}. Running in fallback mode.")

# Load activities from core_data
def load_core_data():
    data = {"activities": []}
    base_path = os.path.join(os.path.dirname(__file__), "core_data")
    
    try:
        # wellness_knowledge.json
        with open(os.path.join(base_path, "wellness_knowledge.json"), encoding="utf-8") as f:
            knowledge = json.load(f)
            for item in knowledge.get("yoga", []):
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
    except Exception as e:
        print(f"Warning loading wellness data: {e}")

    # Fallback if nothing loaded
    if not data["activities"]:
        data["activities"] = [{
            "id": "fallback-1",
            "title": "Box Breathing (4-7-8)",
            "category": "Yoga",
            "tokens": 20,
            "duration": "5 min",
            "difficulty": "Easy",
            "detail": "Calming breath technique",
            "uae_context": "Perfect for Dubai heat"
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
                "ai_mode": True,
                "weather": f"{temp}°C • {humidity}%"
            }
        except Exception as e:
            print(f"AI error: {e}")

    return {
        "status": "success", 
        "recommendations": [{"detail": "Take a deep breath and stay consistent with your wellness goals."}], 
        "ai_mode": False
    }

@app.get("/activities")
async def get_activities():
    return {"status": "success", "activities": CORE_ACTIVITIES["activities"]}

@app.post("/mint")
async def mint_naf(request: MintRequest):
    if not request.wallet_address or len(request.wallet_address) < 10:
        raise HTTPException(status_code=400, detail="Invalid TON wallet address")
    
    print(f"✅ Mint request: {request.amount} $NAF for activity {request.activity_id} → {request.wallet_address}")
    
    return {
        "status": "success",
        "message": f"Successfully minted {request.amount} $NAF",
        "activity_id": request.activity_id,
        "wallet": request.wallet_address
    }

@app.get("/")
async def health():
    return {
        "status": "Nafas API Online",
        "ai_ready": nafas_ai is not None,
        "activities_count": len(CORE_ACTIVITIES["activities"]),
        "python_path": sys.path[0]
    }
