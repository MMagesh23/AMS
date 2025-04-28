import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import AdminLayout from "../layouts/AdminLayout";

const AddStudent = () => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [place, setPlace] = useState('');
  const [parent, setParent] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const gradeOptions = [
    { label: 'LKG', value: -1 },
    { label: 'UKG', value: 0 },
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '10', value: 10 },
    { label: '11', value: 11 },
    { label: '12', value: 12 },
  ];

  const getCategory = (grade) => {
    if (grade >= -1 && grade <= 2) return 'Beginner';
    if (grade >= 3 && grade <= 5) return 'Primary';
    if (grade >= 6 && grade <= 8) return 'Junior';
    if (grade >= 9 && grade <= 12) return 'Inter';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    const category = getCategory(Number(grade)); // Determine category based on grade
    try {
      const response = await api.post(
        '/admin/students',
        {
          name,
          grade: Number(grade), // Convert grade to a number
          place,
          parent,
          phone,
          category, // Add category to the request
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
      setGrade('');
      setPlace('');
      setParent('');
      setPhone('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error creating student');
      setSuccessMessage('');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Add New Student</h2>

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
            <label className="block text-sm font-medium text-gray-700" htmlFor="grade">
              Grade
            </label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Grade
              </option>
              {gradeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="place">
              Place
            </label>
            <input
              type="text"
              id="place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="parent">
              Parent's Name
            </label>
            <input
              type="text"
              id="parent"
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              'Create Student'
            )}
          </button>
        </form>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AddStudent;
