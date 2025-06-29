import os
from pymongo import MongoClient
import certifi

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/matchdb")
client = MongoClient(
    MONGO_URI,
    tls=True,
    tlsCAFile=certifi.where()
)
db = client["matchdb"]
users_collection = db["users"]
comparisons_collection = db["comparisons"]