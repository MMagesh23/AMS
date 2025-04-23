import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../utils/api";

const EditTeacher = () => {
  const { id } = useParams(); // Getting teacher ID from the URL
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState({
    name: '',
    userid: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch teacher details when the component is mounted
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await api.get(`/admin/teachers/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT token
          },
        });
        setTeacherData(response.data);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Error fetching teacher data');
      }
    };

    fetchTeacherData();
  }, [id]);

  const handleChange = (e) => {
    setTeacherData({
      ...teacherData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `/admin/teachers/${id}`,
        teacherData,
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
      setErrorMessage(error.response?.data?.message || 'Error updating teacher');
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Edit Teacher</h2>

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
              value={teacherData.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="userid">
              User ID
            </label>
            <input
              type="text"
              id="userid"
              name="userid"
              value={teacherData.userid}
              onChange={handleChange}
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
              name="password"
              value={teacherData.password}
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

export default EditTeacher;