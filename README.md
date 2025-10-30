# 💚 WellBot - Wellness Chatbot

A modern, interactive wellness chatbot built with React, Tailwind CSS and FastAPI. WellBot provides personalized health advice and symptom guidance through an intuitive chat interface.

## ✨ Features

- **🔐 Secure Authentication** - User registration and login with JWT tokens
- **💬 Smart Chatbot** - AI-powered health advice and symptom analysis
- **🎨 Modern UI** - Beautiful, responsive interface built with React and Tailwind CSS
- **📱 Mobile Friendly** - Fully responsive design that works on all devices
- **🔒 Data Security** - Secure password hashing and token-based authentication
- **📊 Chat History** - Persistent chat history for each user
- **🌐 Multi-language Support** - English, Spanish, and French support
- **🧠 Admin Dashboard** — Manage the knowledge base (add, edit, delete) and view chatbot usage statistics

## 🏗️ Architecture

- **Frontend**: React 18 + Tailwind CSS + React Router
- **Backend**: FastAPI + SQLite + JWT Authentication
- **Database**: SQLite for user data, chat history, and knowledge base

## 🚀 Quick Start

- Install all dependencies
- Start the backend API
- Start the React frontend
- Open your browser to the application

### Manual Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Wellness-Chatbot
   ```

2. **Install Backend Dependencies**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Start the Backend API**

   ```bash
   venv\Scripts\activate
   uvicorn api:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Install Frontend Dependencies**

   ```bash
   cd frontend/frontend
   npm install
   ```

5. **Start the Frontend**

   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
Wellness-Chatbot/
├── backend/
│   ├── api.py              # FastAPI backend server
│   ├── app.py              # Streamlit app (legacy)
│   ├── auth.py             # Authentication utilities
│   ├── bot.py              # Chatbot logic
│   ├── db.py               # Database utilities
│   ├── models.py           # Database models
│   ├── knowledge_base.py   # Knowledge base loader
│   ├── knowledge_base.json # Health knowledge data
│   └── requirements.txt    # Python dependencies
├── frontend/
│   └── frontend/
│       ├── src/
|       |   ├── assets/     # svg files
│       │   └── components/ # React components
│       ├── public/         # Static files
│       └── package.json    # Node.js dependencies
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Chat

- `POST /api/chat` - Send message to bot
- `GET /api/chats/{user_id}` - Get chat history
- `DELETE /api/chats/{user_id}` - Clear chat history

### User Management

- `PUT /api/user/update` - Update user profile

## 🎨 UI Components

### Login/Register

- Clean, modern authentication forms
- Input validation and error handling
- Responsive design for all screen sizes

### Chat Interface

- Real-time messaging with typing indicators
- Message history with timestamps
- Quick suggestion buttons
- Smooth animations and transitions

### Navigation

- User profile dropdown
- Clear chat functionality

### Admin Dashboard

- Add, edit, and delete entries in the knowledge base
- View chatbot usage statistics (Total users,reviews etc.)
- Access restricted to admin users only

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure authentication with configurable expiration
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Pydantic models for request validation
- **SQL Injection Prevention**: Parameterized queries

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your_super_secret_jwt_key_here
JWT_ALGORITHM=HS256
DB_NAME=your_database_name
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin_pass
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**💚 WellBot - Your Personal Wellness Companion**

Built with ❤️ using React, Tailwind CSS, FastAPI, and Streamlit
