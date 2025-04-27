import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AdminLayout from '../layouts/AdminLayout';

const AddVolunteer = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/volunteers', { name, phone });
      setSuccessMessage(res.data.message);
      setErrorMessage('');
      setName('');
      setPhone('');
      setTimeout(() => {
        navigate('/admin/students'); // Redirect after successful creation
      }, 2000);
    } catch (error) {
      setErrorMessage('Error adding volunteer');
      setSuccessMessage('');
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Volunteer</h2>
          {errorMessage && <div className="bg-red-500 text-white p-3 mb-4 rounded-lg">{errorMessage}</div>}
          {successMessage && <div className="bg-green-500 text-white p-3 mb-4 rounded-lg">{successMessage}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg">
              Add Volunteer
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddVolunteer;