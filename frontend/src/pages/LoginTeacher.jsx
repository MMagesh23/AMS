import React, { useState } from 'react';
import api from '../utils/api';
import { saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const LoginTeacher = () => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { userID, password }); // assumes baseURL set in api.js
      saveToken(res.data.token);
      navigate('/teacher/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-200 to-blue-300 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      ><div className="text-center">
        <h2 className="text-sl font-semibold text-indigo-600 mt-2">
          <span className="bg-gradient-to-r from-blue-500 via-green-400 to-teal-500 text-transparent bg-clip-text">
            Presence of Jesus Ministries
          </span>
        </h2>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-400 to-red-500">
          VBS - 2025
        </h1>
        
      </div>
<h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 text-transparent bg-clip-text">
  Teacher Login
</h2>
        
        <input
          type="text"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          placeholder="User ID"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginTeacher;
