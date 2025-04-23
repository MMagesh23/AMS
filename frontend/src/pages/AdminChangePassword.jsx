import { useState } from 'react';
import api from '../utils/api';

const AdminChangePassword = () => {
  const [form, setForm] = useState({ userID: '', newPassword: '', confirmPassword: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.put('https://vbs-amsapi.vercel.app/api/auth/admin-change-password', form);
      alert(res.data.msg);
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error("Failed to change password");
      
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
         <ToastContainer />
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Change Admin Password</h2>
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
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Change Password</button>
      </form>
    </div>
  );
};

export default AdminChangePassword;
