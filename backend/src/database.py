import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/matchdb")
client = MongoClient(MONGO_URI)
db = client["matchmaking"]
users_collection = db["users"]
comparisons_collection = db["comparisons"]