from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["matchmaking"]
users_collection = db["users"]
comparisons_collection = db["comparisons"]