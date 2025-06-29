# backend/src/routes.py

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Dict, Any
from .models import Profile
from .database import users_collection, comparisons_collection
import httpx
import os
import bcrypt
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()

# --- JWT / Auth Setup ---
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")       # ensure set in .env
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload["sub"]  # the username
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# --- Request Models ---
class LoginIn(BaseModel):
    name: str
    password: str

# --- Public Endpoints ---

@router.post("/register", status_code=201)
def register_user(profile: Profile):
    # Check for existing user
    if users_collection.find_one({"name": profile.name}):
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash the password
    hashed = bcrypt.hashpw(profile.password.encode(), bcrypt.gensalt())
    user_dict = profile.dict()
    user_dict["password"] = hashed.decode()

    users_collection.insert_one(user_dict)
    return {"message": "User registered successfully"}


@router.post("/auth/login")
def login(data: LoginIn):
    # Find user
    user = users_collection.find_one({"name": data.name})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password
    if not bcrypt.checkpw(data.password.encode(), user["password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create JWT
    payload = {
        "sub": data.name,
        "exp": datetime.utcnow() + timedelta(hours=4)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/profile/{name}", response_model=Profile)
def get_profile(name: str):
    user = users_collection.find_one({"name": name}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- Protected Endpoints ---
@router.get("/matches/{name}")
def get_matches(
    name: str,
    current_user: str = Depends(get_current_user)
):
    # Fetch the named user
    user = users_collection.find_one({"name": name}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Determine opposite gender
    target_gender = "Female" if user["sex"].lower() == "male" else "Male"

    ml_url = os.getenv("ML_URL", "http://localhost:8100/score")
    matches: List[Dict[str, Any]] = []

    for other in users_collection.find(
        {
            "name": {"$ne": name},
            "sex": {"$regex": f"^{target_gender}$", "$options": "i"}
        },
        {"_id": 0}
    ):
        resp = httpx.post(ml_url, json={"profile1": user, "profile2": other})
        if resp.status_code == 200:
            score = resp.json().get("score")
            matches.append({"name": other["name"], "score": score})

    matches.sort(key=lambda x: x["score"], reverse=True)
    return matches[:5]

@router.post("/compare-and-store", response_model=dict)
async def compare_and_store(payload: dict):
    ml_url = os.getenv("ML_URL", "http://localhost:8100/score")

    # Call ML microservice to compute compatibility score
    async with httpx.AsyncClient() as client:
        resp = await client.post(ml_url, json=payload)
        resp.raise_for_status()
        result = resp.json()  # { "score": float }

    # Store only the names and score in MongoDB
    comparisons_collection.insert_one({
        "profile1": payload["profile1"]["name"],
        "profile2": payload["profile2"]["name"],
        "score": round(result["score"], 2),  # rounding optional
        "timestamp": datetime.utcnow()       # optional: track when it happened
    })

    return {
        "score": result["score"],
        "message": "Comparison stored successfully."
    }