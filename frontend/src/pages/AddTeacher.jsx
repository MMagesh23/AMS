import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AddTeacher = () => {
  const [name, setName] = useState('');
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await api.post(
        '/admin/teachers', // Replace with your actual endpoint
        {
          name,
          userID,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT token for auth
          },
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setName('');
      setUserID('');
      setPassword('');
      setTimeout(() => {
        navigate('/admin/teachers'); // Redirect after successful creation
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error creating teacher');
      setSuccessMessage('');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Add New Teacher</h2>

        {errorMessage && (
          <div className="bg-red-500 text-white p-2 mb-4 rounded">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="bg-green-500 text-white p-2 mb-4 rounded">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="userID">
              UserID
            </label>
            <input
              type="text"
              id="userID"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none flex items-center justify-center"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              'Create Teacher'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTeacher;