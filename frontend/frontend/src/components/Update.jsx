import React, { useState } from "react";
import axios from "axios";

const Update = ({ user, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    language: user.language,
    age: user.age,
    gender: user.gender,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8000/api/user/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Profile updated successfully!");
      onUpdate(formData);
    } catch (error) {
      console.error("Update failed:", error);
      alert("⚠️ Failed to update profile");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-[90%] max-w-md border border-gray-200 transform scale-[0.98] animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-center text-teal-700 mb-8">Update Profile</h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none shadow-sm transition duration-300 hover:shadow-md"
            required
          />

          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none shadow-sm transition duration-300 hover:shadow-md">
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>

          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none shadow-sm transition duration-300 hover:shadow-md"
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none shadow-sm transition duration-300 hover:shadow-md"
            required>
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 shadow-lg transition-all duration-300">
            Update Profile
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 shadow-md transition-all duration-300">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update;
