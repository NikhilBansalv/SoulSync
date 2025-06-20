from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from .preprocessing import profile_to_vector
from .model import score_profiles

app = FastAPI(title="Matchmaking ML Service")

class Profile(BaseModel):
    age: int
    openness: int
    conscientiousness: int
    extraversion: int
    agreeableness: int
    neuroticism: int
    hobbies: List[str]
    smoking: str
    drinking: str

class ScoreRequest(BaseModel):
    profile1: Profile
    profile2: Profile

class ScoreResponse(BaseModel):
    score: float

@app.post("/score", response_model=ScoreResponse)
def get_score(req: ScoreRequest):
    try:
        v1 = profile_to_vector(req.profile1.dict())
        v2 = profile_to_vector(req.profile2.dict())
        score = score_profiles(v1, v2)
        return {"score": score}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
