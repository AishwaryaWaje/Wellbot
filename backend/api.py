from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
from pathlib import Path
import os, json
from dotenv import load_dotenv
load_dotenv()

from db import init_db
from models import (
    create_user, delete_user, get_user_by_email, update_user,
    add_chat, get_chats, clear_chats, get_feedbacks, add_feedback,
    get_total_users, get_total_chats, get_total_feedbacks, get_all_feedbacks
)
from auth import hash_password, verify_password, create_jwt, decode_jwt
from bot import wellness_response

init_db()
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

KNOWLEDGE_BASE_PATH = Path(__file__).parent / "knowledge_base.json"

app = FastAPI(title="WellBot API", version="1.4.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


def format_response(data: dict) -> str:
    """Formats dictionary into readable string with line breaks"""
    return "\n".join([f"{key}: {value}" for key, value in data.items()])


class UserRegister(BaseModel):
    username: str
    email: str
    password: str
    language: str = "English"
    age: int
    gender: str


class UserLogin(BaseModel):
    email: str
    password: str


class ChatMessage(BaseModel):
    message: str
    userId: Optional[int] = None


class UserUpdate(BaseModel):
    username: str
    language: str
    age: int
    gender: str


class Feedback(BaseModel):
    rating: str
    review: Optional[str] = ""


class AdminLogin(BaseModel):
    email: str
    password: str


class DiseaseModel(BaseModel):
    name: str
    symptoms: List[str]
    advice: List[str]



async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_jwt(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    email = payload.get("email")
    user = get_user_by_email(email)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = decode_jwt(token)
    if not payload or payload.get("email") != ADMIN_EMAIL:
        raise HTTPException(status_code=401, detail="Invalid or expired admin token")
    return {"email": ADMIN_EMAIL}

@app.get("/")
async def root():
    return {"message": "WellBot API is running!"}

@app.post("/api/register")
async def register_user(user_data: UserRegister):
    existing_user = get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = hash_password(user_data.password)
    create_user(
        user_data.username, user_data.email, hashed_password,
        user_data.language, user_data.age, user_data.gender
    )
    return {"success": True, "message": "User registered successfully"}


@app.post("/api/login")
async def login_user(login_data: UserLogin):
    user = get_user_by_email(login_data.email)
    if not user or not verify_password(login_data.password, user[3]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_jwt(user[0], user[2])
    user_data = {
        "id": user[0],
        "username": user[1],
        "email": user[2],
        "language": user[4],
        "age": user[5],
        "gender": user[6]
    }
    return {"success": True, "user": user_data, "token": token}


@app.post("/api/chat")
async def send_chat_message(chat_data: ChatMessage, current_user=Depends(get_current_user)):
    user_id = current_user[0]
    user_language = current_user[4] if len(current_user) > 4 and current_user[4] else "English"
    response = wellness_response(chat_data.message, user_language, user_id)
    add_chat(user_id, chat_data.message, response)
    return {"success": True, "response": response}


@app.get("/api/chats/{user_id}")
async def get_user_chats(user_id: int, current_user=Depends(get_current_user)):
    if current_user[0] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    chats = get_chats(user_id)
    return {
        "success": True,
        "chats": [{"message": c[0], "response": c[1], "timestamp": c[2]} for c in chats]
    }


@app.put("/api/user/update")
async def update_user_profile(user_data: UserUpdate, current_user=Depends(get_current_user)):
    update_user(current_user[0], user_data.username, user_data.language, user_data.age, user_data.gender)
    return {"success": True, "message": "Profile updated successfully"}


@app.delete("/api/user/delete")
async def delete_user_account(current_user=Depends(get_current_user)):
    delete_user(current_user[0])
    return {"success": True, "message": "Account deleted successfully"}


@app.delete("/api/chats/{user_id}")
async def clear_user_chats(user_id: int, current_user=Depends(get_current_user)):
    if current_user[0] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    clear_chats(user_id)
    return {"success": True, "message": "Chat history cleared"}


@app.post("/api/feedback")
async def submit_feedback(feedback: Feedback, current_user=Depends(get_current_user)):
    add_feedback(current_user[0], feedback.rating, feedback.review)
    return {"success": True, "message": "Feedback submitted successfully!"}


@app.get("/api/feedbacks")
async def get_user_feedbacks(current_user=Depends(get_current_user)):
    data = get_feedbacks(current_user[0])
    return {"success": True, "feedbacks": [{"rating": f[0], "review": f[1], "timestamp": f[2]} for f in data]}

@app.post("/api/admin/login")
async def admin_login(admin_data: AdminLogin):
    if admin_data.email != ADMIN_EMAIL or admin_data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    token = create_jwt(0, ADMIN_EMAIL)
    return {"success": True, "token": token, "admin": {"email": ADMIN_EMAIL}}


@app.get("/api/admin/dashboard")
async def admin_dashboard(current_admin=Depends(get_current_admin)):
    return {
        "success": True,
        "stats": {
            "total_users": get_total_users(),
            "total_chats": get_total_chats(),
            "total_feedbacks": get_total_feedbacks(),
        },
    }


@app.get("/api/admin/feedbacks")
async def admin_get_feedbacks(current_admin=Depends(get_current_admin)):
    feedbacks = get_all_feedbacks()
    return {"success": True, "feedbacks": feedbacks}


@app.get("/api/admin/stats")
async def admin_stats(current_admin=Depends(get_current_admin)):
    try:
        with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as f:
            knowledge = json.load(f)
        total_diseases = len(knowledge)
        feedbacks = get_all_feedbacks()

        if not feedbacks:
            for i in range(5):
                add_feedback(1, "Positive" if i % 2 == 0 else "Negative", f"Sample review {i + 1}")
            feedbacks = get_all_feedbacks()

        positive = sum(1 for f in feedbacks if f["rating"].lower() == "positive")
        negative = sum(1 for f in feedbacks if f["rating"].lower() == "negative")

        return {
            "users": f"👤 {get_total_users()}",
            "positive": f"👍 {positive}",
            "negative": f"👎 {negative}",
            "diseases": f"🩺 {total_diseases}"
        }
    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/api/admin/latest-reviews")
async def latest_reviews(current_admin=Depends(get_current_admin)):
    feedbacks = get_all_feedbacks()[:3]
    return {"success": True, "latest_reviews": feedbacks}


@app.get("/api/admin/knowledge-base")
async def get_knowledge_base(current_admin=Depends(get_current_admin)):
    with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    diseases = [{"name": k, "symptoms": v["symptoms"], "advice": v["advice"]} for k, v in data.items()]
    return {"success": True, "knowledge_base": diseases}


@app.post("/api/admin/add-disease")
async def add_disease(disease: DiseaseModel, current_admin=Depends(get_current_admin)):
    with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    key = disease.name.lower()
    if key in data:
        raise HTTPException(400, "Disease already exists")
    data[key] = {"symptoms": disease.symptoms, "advice": disease.advice}
    with open(KNOWLEDGE_BASE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    return {"success": True, "message": f"{disease.name} added successfully!"}

@app.put("/api/admin/edit-disease/{name}")
async def edit_disease(name: str, disease: DiseaseModel, current_admin=Depends(get_current_admin)):
    with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    key = name.lower()
    if key not in data:
        raise HTTPException(404, "Disease not found")
    data[key] = {"symptoms": disease.symptoms, "advice": disease.advice}
    with open(KNOWLEDGE_BASE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    return {"success": True, "message": f"{name} updated successfully!"}


@app.delete("/api/admin/delete-disease/{name}")
async def remove_disease(name: str, current_admin=Depends(get_current_admin)):
    with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    key = name.lower()
    if key not in data:
        raise HTTPException(404, "Disease not found")
    del data[key]
    with open(KNOWLEDGE_BASE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    return {"success": True, "message": f"{name} deleted successfully!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
