import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";

const ChatBox = ({ user, onLogout, onUpdateProfile, onFeedback }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const key = `chat_${user.username}`;
    const savedData = localStorage.getItem(key);

    if (savedData) {
      const { messages: savedMessages, timestamp } = JSON.parse(savedData);
      const now = new Date().getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      if (now - timestamp < sevenDays) {
        setMessages(savedMessages);
        return;
      }
    }

    const initialMessage = [
      {
        sender: "bot",
        text: `Welcome ${user.username}! How can I support your wellness today?`,
      },
    ];
    setMessages(initialMessage);
    localStorage.setItem(
      key,
      JSON.stringify({ messages: initialMessage, timestamp: new Date().getTime() })
    );
  }, [user.username]);

  useEffect(() => {
    if (messages.length === 0) return;

    const key = `chat_${user.username}`;
    localStorage.setItem(key, JSON.stringify({ messages, timestamp: new Date().getTime() }));
  }, [messages, user.username]);

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8000/api/chat",
        { message: userInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botReply = res.data.response || "I'm here to help!";
      setMessages([...newMessages, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { sender: "bot", text: "⚠️ Error contacting server." }]);
    }

    setUserInput("");
    setLoading(false);
  };

  const handleClear = () => {
    const initialMessage = [
      {
        sender: "bot",
        text: `Welcome ${user.username}! How can I support your wellness today?`,
      },
    ];
    setMessages(initialMessage);
    localStorage.setItem(
      `chat_${user.username}`,
      JSON.stringify({ messages: initialMessage, timestamp: new Date().getTime() })
    );
  };

  const renderMessageText = (text) => {
    if (text.includes("\n")) {
      return text.split("\n").map((line, i) => (
        <p key={i} className="leading-relaxed">
          {line.trim()}
        </p>
      ));
    }

    if (text.includes("- ")) {
      return text.split("- ").map(
        (line, i) =>
          line.trim() && (
            <p key={i} className="leading-relaxed">
              - {line.trim()}
            </p>
          )
      );
    }

    return <p className="leading-relaxed">{text}</p>;
  };

  return (
    <div className="h-screen w-screen bg-white flex flex-col items-center justify-between font-[Poppins] relative overflow-hidden">
      <header className="w-full flex justify-between items-center px-10 py-4 bg-white shadow-md fixed top-0 z-20">
        <h1 className="text-3xl font-semibold text-teal-700 flex items-center gap-2">
          Health & Wellness Chatbot
        </h1>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-teal-700 text-white px-3 py-2 rounded-full shadow-md hover:bg-teal-800 transition">
            <FaUserCircle className="text-xl" />
            {user.username}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-40 z-30">
              <button
                onClick={onUpdateProfile}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Update Profile
              </button>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mt-24 mb-28 px-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] shadow ${
                msg.sender === "user" ? "bg-yellow-100 text-right" : "bg-teal-100 text-left"
              }`}>
              {renderMessageText(msg.text)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-teal-100 text-left animate-pulse">
              Typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <footer className="w-full fixed bottom-0 bg-white shadow-inner py-4 flex flex-col items-center z-20">
        <form onSubmit={sendMessage} className="flex items-center w-full max-w-4xl px-6 mb-2">
          <input
            type="text"
            className="flex-1 border-2 border-teal-700 rounded-l-full px-4 py-2 focus:outline-none"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white px-5 py-2 rounded-r-full hover:bg-gray-800 transition">
            <FaPaperPlane />
          </button>
        </form>

        <div className="absolute left-6 bottom-4 flex gap-3">
          <button
            onClick={onFeedback}
            className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2 rounded-full hover:bg-yellow-600 transition">
            💬 Feedback
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-2 bg-teal-500 text-white px-5 py-2 rounded-full hover:bg-teal-600 transition">
            🗑 Clear Chat
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatBox;
