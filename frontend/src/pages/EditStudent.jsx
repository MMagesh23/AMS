import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../utils/api"; 

const EditStudent = () => {
  const { id } = useParams(); // Getting student ID from the URL
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    name: '',
    grade: '',
    place: '',
    parent: '',
    phone: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch student details when the component is mounted
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await api.get(`/admin/students/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT token
          },
        });
        setStudentData(response.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Error fetching student data');
      }
    };

    fetchStudentData();
  }, [id]);

  const handleChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `/admin/students/${id}`,
        studentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT token
          },
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setTimeout(() => {
        navigate('/admin/dashboard'); // Redirect after successful edit
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error updating student');
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Edit Student</h2>

        {errorMessage && <div className="bg-red-500 text-white p-2 mb-4 rounded">{errorMessage}</div>}
        {successMessage && <div className="bg-green-500 text-white p-2 mb-4 rounded">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={studentData.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="grade">
              Grade
            </label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={studentData.grade}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="place">
              Place
            </label>
            <input
              type="text"
              id="place"
              name="place"
              value={studentData.place}
              onChange={handleChange}
              required
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
              name="parent"
              value={studentData.parent}
              onChange={handleChange}
              required
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
              name="phone"
              value={studentData.phone}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
