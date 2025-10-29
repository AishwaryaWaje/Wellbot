import React, { useState } from "react";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import ChatBox from "./components/ChatBox.jsx";
import Update from "./components/Update.jsx";
import Feedback from "./components/Feedback.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  if (isAdmin) {
    return <AdminDashboard onLogout={() => setIsAdmin(false)} />;
  }

  return (
    <div>
      {!user ? (
        showAdminLogin ? (
          <AdminLogin onBack={() => setShowAdminLogin(false)} onLogin={() => setIsAdmin(true)} />
        ) : showRegister ? (
          <Register onSwitch={() => setShowRegister(false)} onRegister={(u) => setUser(u)} />
        ) : (
          <Login onSwitch={() => setShowRegister(true)} onLogin={(u) => setUser(u)} />
        )
      ) : showUpdate ? (
        <Update
          user={user}
          onUpdate={(u) => {
            setUser(u);
            setShowUpdate(false);
          }}
          onCancel={() => setShowUpdate(false)}
        />
      ) : showFeedback ? (
        <Feedback onBack={() => setShowFeedback(false)} />
      ) : (
        <ChatBox
          user={user}
          onLogout={() => setUser(null)}
          onUpdateProfile={() => setShowUpdate(true)}
          onFeedback={() => setShowFeedback(true)}
        />
      )}

      {!user && !isAdmin && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowAdminLogin(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            title="Admin Login">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="gray"
              className="w-6 h-6 hover:stroke-teal-700">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253l6.928 3.986a.75.75 0 010 1.294L12 15.519l-6.928-3.986a.75.75 0 010-1.294L12 6.253z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
