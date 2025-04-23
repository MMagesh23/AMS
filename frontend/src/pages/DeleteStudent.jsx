import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; 

const DeleteStudent = ({ studentId }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDelete = async () => {
    try {
      const response = await api.delete(`/admin/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT token
        },
      });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setTimeout(() => {
        navigate('/admin/dashboard'); // Redirect after successful deletion
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error deleting student');
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Delete Student</h2>

        {errorMessage && <div className="bg-red-500 text-white p-2 mb-4 rounded">{errorMessage}</div>}
        {successMessage && <div className="bg-green-500 text-white p-2 mb-4 rounded">{successMessage}</div>}

        <p>Are you sure you want to delete this student?</p>

        <div className="flex justify-between mt-4">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStudent;
