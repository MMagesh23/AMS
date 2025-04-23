import { useState } from 'react';
import api from '../utils/api';
import { toast, ToastContainer } from "react-toastify";

const AdminRegister = () => {
  const [form, setForm] = useState({ userID: '', password: '', confirmPassword: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('https://vbs-ams.vercel.app/api/auth/admin-register', form);
      toast.success("Registration successfully");
    } catch (err) {
      toast.error("Registration failed");
    }
  };



  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
         <ToastContainer />
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Register</h2>
        <input
          type="text"
          name="userID"
          placeholder="User ID"
          value={form.userID}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
};

export default AdminRegister;
