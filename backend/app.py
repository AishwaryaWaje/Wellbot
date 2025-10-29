import streamlit as st
import sys
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.append(BACKEND_DIR)

from db import init_db
from models import create_user, get_user_by_email, update_user, add_chat, get_chats, clear_chats
from auth import hash_password, verify_password, create_jwt, decode_jwt
from bot import wellness_response

init_db()

LANGUAGE_OPTIONS = ["English", "Hindi"]

def register():
    st.subheader("Create Account")
    username = st.text_input("Username")
    email = st.text_input("Email")
    password = st.text_input("Password", type="password")
    language = st.selectbox("Language", LANGUAGE_OPTIONS)
    age = st.number_input("Age", min_value=1, max_value=120, value=25)
    gender = st.selectbox("Gender", ["Male", "Female", "Other"])
    if st.button("Register"):
        if not username or not email or not password:
            st.error("Please fill all fields.")
            return
        if get_user_by_email(email):
            st.error("Email already exists!")
        else:
            hashed = hash_password(password)
            create_user(username, email, hashed, language, age, gender)
            st.success("Account created! Please login.")

def login():
    st.subheader("Login")
    email = st.text_input("Email (login)")
    password = st.text_input("Password (login)", type="password")
    if st.button("Login"):
        user = get_user_by_email(email)
        if user and verify_password(password, user[3]):
            token = create_jwt(user[0], user[2])
            st.session_state['token'] = token
            st.session_state['user'] = user
            st.success("Logged in!")
        else:
            st.error("Invalid credentials.")

def account_settings(user):
    st.subheader("Update Account")
    try:
        current_lang = user[4] if user[4] in LANGUAGE_OPTIONS else "English"
    except Exception:
        current_lang = "English"
    username = st.text_input("Username", value=user[1])
    language = st.selectbox("Language", LANGUAGE_OPTIONS, index=LANGUAGE_OPTIONS.index(current_lang))
    age = st.number_input("Age", min_value=1, max_value=120, value=user[5] or 25)
    try:
        current_gender_index = ["Male", "Female", "Other"].index(user[6]) if user[6] in ["Male", "Female", "Other"] else 0
    except Exception:
        current_gender_index = 0
    gender = st.selectbox("Gender", ["Male", "Female", "Other"], index=current_gender_index)
    if st.button("Update"):
        update_user(user[0], username, language, age, gender)
        st.session_state['user'] = get_user_by_email(user[2])
        st.success("Account updated!")

def chatbot(user):
    st.subheader("Wellness Chatbot")
    chats = get_chats(user[0])
    for msg, resp, ts in chats:
        st.markdown(f"**You:** {msg}\n\n**Bot:** {resp}\n\n*{ts}*")
    msg = st.text_input("Your message")
    if st.button("Send"):
        if not msg:
            st.warning("Type a message first.")
        else:
            user_lang = user[4] if user[4] else "English"
            resp = wellness_response(msg, user_lang)
            add_chat(user[0], msg, resp)
            st.experimental_rerun()
    if st.button("Clear Chat"):
        clear_chats(user[0])
        st.experimental_rerun()

def main():
    st.title("Wellness Chatbot")
    if "token" not in st.session_state:
        menu = st.sidebar.selectbox("Menu", ["Login", "Register"])
        if menu == "Register":
            register()
        else:
            login()
    else:
        user = st.session_state['user']
        menu = st.sidebar.selectbox("Menu", ["Chat", "Update Account", "Logout"])
        if menu == "Chat":
            chatbot(user)
        elif menu == "Update Account":
            account_settings(user)
        elif menu == "Logout":
            st.session_state.clear()
            st.experimental_rerun()

if __name__ == "__main__":
    main()
