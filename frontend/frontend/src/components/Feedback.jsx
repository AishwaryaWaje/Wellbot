import React, { useState } from "react";
import axios from "axios";

const Feedback = ({ onBack }) => {
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      alert("Please select a feedback type (👍 or 👎)");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to submit feedback.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        "http://localhost:8000/api/feedback",
        { rating, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success || res.data.message) {
        alert("✅ Thank you for your feedback!");
        setReview("");
        setRating(null);
        onBack();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Feedback submission failed:", error);
      alert("⚠️ Error submitting feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-teal-50 to-teal-100 font-[Poppins]">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md transition-all duration-300">
        <h1 className="text-2xl font-semibold text-center text-teal-700 mb-6">
          Share Your Feedback
        </h1>

        <div className="flex justify-center gap-10 mb-6">
          <button
            type="button"
            onClick={() => setRating("positive")}
            className={`text-5xl transition-all duration-300 transform ${
              rating === "positive"
                ? "scale-110 drop-shadow-md"
                : "opacity-60 hover:opacity-100 hover:scale-105"
            }`}
            style={{
              color: rating === "positive" ? "#22c55e" : "#9ca3af",
              filter: rating === "positive" ? "drop-shadow(0 0 6px #22c55e)" : "none",
            }}>
            👍
          </button>

          <button
            type="button"
            onClick={() => setRating("negative")}
            className={`text-5xl transition-all duration-300 transform ${
              rating === "negative"
                ? "scale-110 drop-shadow-md"
                : "opacity-60 hover:opacity-100 hover:scale-105"
            }`}
            style={{
              color: rating === "negative" ? "#ef4444" : "#9ca3af",
              filter: rating === "negative" ? "drop-shadow(0 0 6px #ef4444)" : "none",
            }}>
            👎
          </button>
        </div>

        <textarea
          placeholder="Write your review..."
          className="w-full border border-teal-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500"
          rows="4"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>

        <button
          onClick={onBack}
          className="mt-4 text-sm text-gray-500 underline hover:text-teal-700 block text-center">
          ← Back to Chat
        </button>
      </div>
    </div>
  );
};

export default Feedback;
