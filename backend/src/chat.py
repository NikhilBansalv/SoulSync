from typing import Dict
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from jose import JWTError, jwt
from starlette.websockets import WebSocketClose
from .database import db 
from .routes import get_current_user
from pymongo import DESCENDING
import json
import uuid
from datetime import datetime

router = APIRouter()    

class ConnectionManager:
    def __init__(self):
        self.active: Dict[str, Dict[str, WebSocket]] = {}  

    async def connect(self, room_id: str, username: str, ws: WebSocket):
        await ws.accept()
        self.active.setdefault(room_id, {})[username] = ws

    def disconnect(self, room_id: str, username: str):
        self.active.get(room_id, {}).pop(username, None)

    async def broadcast(self, room_id: str, message: dict):
        for ws in self.active.get(room_id, {}).values():
            await ws.send_text(json.dumps(message))

manager = ConnectionManager()

SECRET_KEY = "NcZTVg+/bAKYuxEN92IhlGPlWLokqHjrVwnTiPUKFgQ="
ALGORITHM = "HS256"

@router.websocket("/ws/chat/{room_id}")
async def chat_websocket(websocket: WebSocket, room_id: str):
    # Step 1: Accept connection
    await websocket.accept()

    # Step 2: Read token from query params
    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    # Step 3: Decode JWT manually
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise JWTError()
    except JWTError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    # Proceed with chat logic
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"You said: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")