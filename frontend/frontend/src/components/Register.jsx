import React, { useState } from "react";
import axios from "axios";
import { FaHeartbeat } from "react-icons/fa";
import registerIllustration from "../assets/doctor.svg";

const Register = ({ onSwitch, onRegister }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    language: "English",
    age: "",
    gender: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/register", {
        ...form,
        age: parseInt(form.age, 10),
      });
      setMessage(res.data.message || "Registered successfully!");
      onRegister(res.data.user);
    } catch (err) {
      setMessage("Registration failed. " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row overflow-hidden">
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-blue-500 via-teal-400 to-green-300 text-white flex-col justify-center items-center p-10">
        <img
          src={registerIllustration}
          alt="Doctor Illustration"
          className="w-[80%] max-w-md mb-6 drop-shadow-2xl transition-transform duration-300 hover:scale-105"
        />

        <p className="text-lg text-center max-w-md leading-relaxed opacity-90">
          Create your personalized health account and chat with our AI wellness assistant.
        </p>
      </div>

      <div className="flex flex-1 justify-center items-center bg-linear-to-br from-white to-gray-100">
        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 xl:p-10 w-[90%] max-w-md border border-teal-200 transform scale-[0.95] xl:scale-100">
          <div className="flex flex-col items-center mb-5">
            <FaHeartbeat className="text-5xl text-teal-500 mb-3 animate-pulse" />
            <h2 className="text-3xl font-bold text-teal-700 text-center">Create Your Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />

            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none">
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              required
              min="1"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none">
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>

            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-all shadow-md">
              Register
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              onClick={onSwitch}
              className="text-teal-600 font-semibold underline hover:text-teal-800">
              Login
            </button>
          </p>

          {message && <p className="text-center text-red-500 font-medium mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Register;
