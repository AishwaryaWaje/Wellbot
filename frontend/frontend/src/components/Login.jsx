import React, { useState } from "react";
import axios from "axios";
import { FaUserMd } from "react-icons/fa";
import healthIllustration from "../assets/healthcare.svg";

const Login = ({ onSwitch, onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8000/api/login", form, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        onLogin(res.data.user);
      } else {
        setMessage("Invalid login details.");
      }
    } catch (err) {
      setMessage("Login failed. " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen">
      <div className="lg:w-1/2 w-full bg-linear-to-br from-teal-500 via-cyan-400 to-blue-500 flex flex-col justify-center items-center p-10 text-blue">
        <img
          src={healthIllustration}
          alt="Healthcare Illustration"
          className="max-w-md w-full mb-10 drop-shadow-2xl animate-fadeIn"
        />
        <h1 className="text-5xl font-extrabold mb-4 text-center text-white">
          Welcome to <span className="text-yellow-300">WellBot</span>
        </h1>
        <p className="text-lg text-center max-w-md opacity-90 font-medium">
          Your trusted AI-powered healthcare assistant. <br /> Stay healthy, stay informed.
        </p>
      </div>

      <div className="lg:w-1/2 w-full flex justify-center items-center bg-gray-50 p-6">
        <div className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-3xl p-10 w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <FaUserMd className="text-6xl text-teal-500 mb-4 drop-shadow-lg" />
            <h2 className="text-3xl font-bold text-teal-700 text-center">Login to Chat</h2>
            <p className="text-gray-500 mt-2 text-center">
              Access your personalized WellBot experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none shadow-sm transition-all"
            />
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none shadow-sm transition-all"
            />

            <button
              type="submit"
              className="w-full bg-linear-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg">
              Login
            </button>
          </form>

          {message && (
            <p className="text-center text-red-500 font-medium mt-4 bg-red-50 p-2 rounded-lg border border-red-200">
              {message}
            </p>
          )}

          <p className="text-center mt-6 text-gray-600 text-sm">
            Don’t have an account?{" "}
            <button
              onClick={onSwitch}
              className="text-teal-600 font-semibold underline hover:text-teal-800">
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
