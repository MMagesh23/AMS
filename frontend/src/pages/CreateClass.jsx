// Pages/CreateClass.jsx
import { useState } from 'react';
import axios from 'axios';
import api from '../utils/api';


const CreateClass = () => {
  const [formData, setFormData] = useState({ name: '', category: 'Beginner' });
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/classes', formData);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating class');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Class</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Class Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <select
          className="w-full p-2 border rounded"
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
        >
          {['Beginner', 'Primary', 'Junior', 'Inter'].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
          Create Class
        </button>
        {message && <p className="text-sm mt-2 text-gray-700">{message}</p>}
      </form>
    </div>
  );
};

export default CreateClass;
