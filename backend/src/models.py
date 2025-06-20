# backend/src/models.py
from pydantic import BaseModel
from typing import List

class Profile(BaseModel):
    name: str
    password: str
    age: int
    sex: str
    openness: int
    conscientiousness: int
    extraversion: int
    agreeableness: int
    neuroticism: int
    hobbies: List[str]
    smoking: str
    drinking: str
