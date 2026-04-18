import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# === REAL AI ENGINE ===
from core.ai_logic import NafasProAI

app = FastAPI(title="Nafas Wellness API")

# FULL PERMISSIVE CORS FOR TELEGRAM MINI APP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====================== LIVE AI INSTANCE ======================
try:
    nafas_ai = NafasProAI()
    print("✅ NafasProAI initialized successfully (Pinecone + OpenAI)")
except Exception as e:
    nafas_ai = None
    print(f"⚠️  AI initialization failed: {e}. Falling back to static knowledge.")

# ====================== LOAD REAL CORE DATA ======================
def load_core_data():
    data = {"activities": []}
    base_path = os.path.join(os.path.dirname(__file__), "core_data")
    
    # wellness_knowledge.json
    try:
        with open(os.path.join(base_path, "wellness_knowledge.json"), "r", encoding="utf-8") as f:
            knowledge = json.load(f)
            for item in knowledge.get("yoga", []):
                data["activities"].append({
                    "id": f"yoga-{len(data['activities'])}",
                    "title": item.get("pose", "Yoga Pose"),
                    "category": "Yoga",
                    "tokens": 30,
                    "duration": "8 min",
                    "difficulty": "Easy",
                    "detail": item.get("secret", "") + " - " + item.get("benefit", ""),
                    "uae_context": item.get("uae_context", "Perfect for UAE heat")
                })
            for item in knowledge.get("endurance", []):
                data["activities"].append({
                    "id": f"endurance-{len(data['activities'])}",
                    "title": item.get("topic", "Endurance Training"),
                    "category": "Endurance",
                    "tokens": 65,
                    "duration": "30 min",
                    "difficulty": "Medium",
                    "detail": item.get("detail", ""),
                    "uae_context": item.get("uae_context", "")
                })
    except Exception as e:
        print(f"Warning: Could not load wellness_knowledge.json → {e}")

    # endurance_secrets.json
    try:
        with open(os.path.join(base_path, "endurance_secrets.json"), "r", encoding="utf-8") as f:
            secrets = json.load(f)
            for item in secrets:
                data["activities"].append({
                    "id": f"secret-{len(data['activities'])}",
                    "title": item.get("topic", "Endurance Secret"),
                    "category": "Endurance",
                    "tokens": 80,
                    "duration": "25 min",
                    "difficulty": "Hard",
                    "detail": item.get("detail", ""),
                    "uae_context": item.get("uae_context", "Best done early morning in UAE")
                })
    except Exception as e:
        print(f"Warning: Could not load endurance_secrets.json → {e}")

    # dental_wellness.json
    try:
        with open(os.path.join(base_path, "dental_wellness.json"), "r", encoding="utf-8") as f:
            dental = json.load(f)
            for item in dental:
                data["activities"].append({
                    "id": f"dental-{len(data['activities'])}",
                    "title": item.get("topic", "Dental Ritual"),
                    "category": "Dental",
                    "tokens": 15,
                    "duration": "10 min",
                    "difficulty": "Easy",
                    "detail": item.get("detail", ""),
                    "uae_context": "Great after Arabic coffee or dates"
                })
    except Exception as e:
        print(f"Warning: Could not load dental_wellness.json → {e}")

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

# ====================== MODELS ======================
class UserQuery(BaseModel):
    goal: str
    location: str = "Dubai"

class MintRequest(BaseModel):
    activity_id: str = Field(..., description="ID of the completed activity")
    amount: int = Field(..., gt=0, description="Number of $NAF tokens to mint")
    wallet_address: str = Field(..., description="User's TON wallet address")

# ====================== ENDPOINTS ======================

@app.post("/recommend")
async def recommend(query: UserQuery):
    goal_lower = query.goal.lower().strip()
    
    if nafas_ai:
        if "fujairah" in query.location.lower() or "fujairah" in goal_lower:
            temp, humidity = 31, 68
        elif "dubai" in query.location.lower() or "dxb" in goal_lower:
            temp, humidity = 34, 55
        else:
            temp, humidity = 32, 60

        try:
            ai_json_str = nafas_ai.generate_smart_recommendation(
                goal=query.goal,
                temp=temp,
                humidity=humidity
            )
            parsed = json.loads(ai_json_str)
            transformed = {
                "topic": parsed.get("title", "Nafas Smart Recommendation"),
                "detail": parsed.get("plan", "Personalized wellness plan generated."),
                "benefit": parsed.get("safety_tip", "Stay hydrated and listen to your body.")
            }
            return {
                "status": "success",
                "recommendations": [transformed],
                "ai_mode": True,
                "weather": f"{temp}°C • {humidity}% humidity"
            }
        except Exception as ai_error:
            print(f"AI call failed: {ai_error}. Falling back to static.")

    # Static fallback
    if "yoga" in goal_lower:
        res = [{"pose": "Sitali Pranayama", "secret": "Cooling Breath", "detail": "Curling tongue to lower body temp."}]
    elif "run" in goal_lower or "endurance" in goal_lower:
        res = [{"topic": "Running", "secret": "2:2 Rhythm", "detail": "Sync breath with steps."}]
    elif "smoke" in goal_lower:
        res = [{"tactic": "Box Breath", "detail": "4-4-4-4 rhythm to stop cravings."}]
    elif "teeth" in goal_lower or "dental" in goal_lower:
        res = [{"topic": "Dental", "secret": "Alkaline Rinsing", "detail": "Salt water after dates."}]
    else:
        res = [{"secret": "Nafas AI", "detail": "Take a deep breath. I'm here to help."}]

    return {"status": "success", "recommendations": res, "ai_mode": False}


@app.get("/activities")
async def get_activities():
    return {
        "status": "success",
        "activities": CORE_ACTIVITIES["activities"]
    }


@app.post("/mint")
async def mint_naf(request: MintRequest):
    """
    Mint $NAF tokens for completed activities.
    In production: Call your TON contract or use a backend minter wallet.
    """
    if not request.wallet_address.startswith("EQ") and not request.wallet_address.startswith("UQ"):
        raise HTTPException(status_code=400, detail="Invalid TON wallet address format")

    # Simulate minting (replace with real TON interaction later)
    print(f"🔨 Minting {request.amount} $NAF for activity {request.activity_id} to wallet {request.wallet_address}")

    # TODO: In real implementation, here you would:
    # 1. Verify the activity was actually completed by the user
    # 2. Call NafasToken.mintReward via TON SDK or backend signer

    return {
        "status": "success",
        "message": f"Successfully minted {request.amount} $NAF",
        "activity_id": request.activity_id,
        "wallet": request.wallet_address,
        "tx_simulation": f"TON tx hash would appear here in production",
        "timestamp": "2026-04-19T00:00:00Z"
    }


@app.get("/")
async def health():
    return {
        "status": "Nafas API Online",
        "ai_engine": "✅ LIVE" if nafas_ai else "⚠️ FALLBACK",
        "activities_loaded": len(CORE_ACTIVITIES["activities"]),
        "minting_enabled": True,
        "version": "1.3.0"
    }


@app.get("/nearby")
async def nearby():
    return {
        "spots": [
            {"name": "Kite Beach Yoga", "activity": "Yoga", "location": "Dubai"},
            {"name": "Al Qudra Cycle Track", "activity": "Cycling", "location": "Dubai"},
            {"name": "Mushrif Park", "activity": "Running / Hiking", "location": "Dubai"},
            {"name": "Fujairah Corniche", "activity": "Beach Walk", "location": "Fujairah"}
        ]
    }


@app.get("/ai-test")
async def ai_test():
    if not nafas_ai:
        return {"error": "AI not initialized"}
    result = nafas_ai.generate_smart_recommendation(
        goal="Morning yoga for energy in humid weather",
        temp=33,
        humidity=62
    )
    return {"raw_ai_response": result}
