import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // ✅ Use centralized API config
import { ToastContainer, toast } from "react-toastify"; // If using toast
import "react-toastify/dist/ReactToastify.css";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { userID, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Login successfully");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <ToastContainer />

        {/* Gradient-Styled Headings */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-indigo-600">
            <span className="bg-gradient-to-r from-blue-500 via-green-400 to-teal-500 text-transparent bg-clip-text">
              Presence of Jesus Ministries
            </span>
          </h2>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-400 to-red-500">
            VBS 2025
          </h1>
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 text-transparent bg-clip-text mt-4">
            Admin Login
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* User ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="text"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              placeholder="Enter your User ID"
              className="w-full mt-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              className="w-full mt-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
