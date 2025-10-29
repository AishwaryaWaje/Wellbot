import React, { useState } from "react";
import axios from "axios";

const AdminLogin = ({ onLogin, onBack }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/admin/login", form);
      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        onLogin();
      } else {
        setMessage("Invalid admin credentials");
      }
    } catch (err) {
      setMessage("Login failed. " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-linear-to-br from-teal-100 to-blue-100">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-[90%] max-w-md text-center">
        <h2 className="text-3xl font-bold text-teal-700 mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Admin email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition">
            Login
          </button>
        </form>
        {message && <p className="text-red-500 mt-3">{message}</p>}

        <button
          onClick={onBack}
          className="mt-4 text-sm text-gray-500 underline hover:text-teal-700">
          ← Back to User Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
