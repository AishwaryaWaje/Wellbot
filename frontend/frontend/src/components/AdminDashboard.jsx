import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaVirus,
  FaSmile,
  FaFrown,
  FaBookMedical,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaQuoteLeft,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [reviews, setReviews] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [newDisease, setNewDisease] = useState({
    name: "",
    symptoms: "",
    advice: "",
  });
  const [editingDisease, setEditingDisease] = useState(null);

  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAllData = async () => {
    try {
      const [statsRes, reviewsRes, kbRes] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/stats", { headers }),
        axios.get("http://localhost:8000/api/admin/latest-reviews", { headers }),
        axios.get("http://localhost:8000/api/admin/knowledge-base", { headers }),
      ]);

      setStats(statsRes.data);
      setReviews(reviewsRes.data.latest_reviews || []);
      setKnowledgeBase(kbRes.data.knowledge_base || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddOrUpdateDisease = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newDisease.name.trim(),
        symptoms: newDisease.symptoms.split(",").map((s) => s.trim()),
        advice: newDisease.advice.split("\n").map((a) => a.trim()),
      };

      if (editingDisease) {
        await axios.put(
          `http://localhost:8000/api/admin/edit-disease/${editingDisease.name}`,
          payload,
          { headers }
        );
        alert("✅ Disease updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/admin/add-disease", payload, { headers });
        alert("✅ Disease added successfully!");
      }

      setNewDisease({ name: "", symptoms: "", advice: "" });
      setEditingDisease(null);
      fetchAllData();
    } catch (err) {
      console.error("Error adding/updating disease:", err);
      alert("❌ Failed to save disease");
    }
  };

  const handleEditDisease = (disease) => {
    setEditingDisease(disease);
    setNewDisease({
      name: disease.name,
      symptoms: disease.symptoms.join(", "),
      advice: disease.advice.join("\n"),
    });
  };

  const handleDeleteDisease = async (name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/delete-disease/${name}`, { headers });
      alert("🗑️ Disease deleted successfully!");
      fetchAllData();
    } catch (err) {
      console.error("Error deleting disease:", err);
      alert("❌ Failed to delete disease");
    }
  };

  const handleCancelEdit = () => {
    setEditingDisease(null);
    setNewDisease({ name: "", symptoms: "", advice: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-emerald-800">Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin-login";
          }}
          className="bg-red-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-600 transition">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-5 border-t-4 border-emerald-500">
          <div className="flex items-center gap-2 mb-2 text-emerald-700 font-semibold">
            <FaUser /> Total Users
          </div>
          <p className="text-2xl font-bold text-emerald-800">{stats.users || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border-t-4 border-green-500">
          <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold">
            <FaSmile /> Positive Reviews
          </div>
          <p className="text-2xl font-bold text-green-800">{stats.positive || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border-t-4 border-red-500">
          <div className="flex items-center gap-2 mb-2 text-red-700 font-semibold">
            <FaFrown /> Negative Reviews
          </div>
          <p className="text-2xl font-bold text-red-800">{stats.negative || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 border-t-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold">
            <FaVirus /> Total Diseases
          </div>
          <p className="text-2xl font-bold text-blue-800">{stats.diseases || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
          Latest Reviews
        </h2>

        {reviews.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {reviews.map((r, i) => (
              <li
                key={i}
                className={`p-4 ${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-emerald-50 transition rounded-lg`}>
                <div className="flex items-center gap-2 mb-2">
                  {r.rating.toLowerCase() === "positive" ? (
                    <FaSmile className="text-green-600 text-lg" />
                  ) : (
                    <FaFrown className="text-red-600 text-lg" />
                  )}
                  <span
                    className={`font-semibold ${
                      r.rating.toLowerCase() === "positive" ? "text-green-700" : "text-red-700"
                    }`}>
                    {r.rating}
                  </span>
                </div>
                <p className="text-gray-800 italic">“{r.review}”</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No reviews yet</p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
            <FaBookMedical /> Knowledge Base
          </h2>
          {knowledgeBase.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
              {knowledgeBase.map((disease, i) => (
                <div key={i} className="p-4 border rounded-lg bg-gray-50 hover:shadow transition">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-emerald-800 text-lg">🩺 {disease.name}</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditDisease(disease)}
                        className="text-blue-600 hover:text-blue-800">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteDisease(disease.name)}
                        className="text-red-600 hover:text-red-800">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    <strong>Symptoms:</strong> {"\n"}
                    {disease.symptoms.join("\n")}
                  </p>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                    <strong>Advice:</strong> {"\n"}
                    {disease.advice.join("\n")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No diseases added yet.</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
            {editingDisease ? <FaEdit /> : <FaPlus />}{" "}
            {editingDisease ? "Edit Disease" : "Add New Disease"}
          </h2>
          <form onSubmit={handleAddOrUpdateDisease} className="space-y-4">
            <input
              type="text"
              placeholder="Disease name"
              value={newDisease.name}
              onChange={(e) => setNewDisease({ ...newDisease, name: e.target.value })}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-400 outline-none"
              required
            />
            <textarea
              placeholder="Symptoms (comma separated)"
              value={newDisease.symptoms}
              onChange={(e) => setNewDisease({ ...newDisease, symptoms: e.target.value })}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-400 outline-none h-20"
              required
            />
            <textarea
              placeholder="Advice (each line separate)"
              value={newDisease.advice}
              onChange={(e) => setNewDisease({ ...newDisease, advice: e.target.value })}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-emerald-400 outline-none h-24"
              required
            />

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                {editingDisease ? <FaEdit /> : <FaPlus />}
                {editingDisease ? "Update Disease" : "Add Disease"}
              </button>
              {editingDisease && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition flex items-center justify-center gap-2">
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
