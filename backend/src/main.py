from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="Matchmaking Backend API")

# Allow your React dev origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
