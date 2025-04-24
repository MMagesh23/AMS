import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userID: '', password: '', confirmPassword: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();

    // Frontend validation for password and confirm password
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      const res = await api.post('/auth/admin-register', { userID: form.userID, password: form.password });
      toast.success("Registration successfully");
      navigate('/admin-login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-200 px-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
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
            Admin Registration
          </h2>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="text"
              name="userID"
              placeholder="Enter your User ID"
              value={form.userID}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-semibold shadow-lg transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
