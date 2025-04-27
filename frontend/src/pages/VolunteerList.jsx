import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AdminLayout from '../layouts/AdminLayout';

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const res = await api.get('/admin/volunteers');
      setVolunteers(res.data);
      setLoading(false);
    } catch (error) {
      setErrorMessage('Error fetching volunteers');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this volunteer?')) return;

    try {
      await api.delete(`/admin/volunteers/${id}`);
      setSuccessMessage('Volunteer deleted successfully');
      setVolunteers((prev) => prev.filter((volunteer) => volunteer._id !== id));
    } catch (error) {
      setErrorMessage('Error deleting volunteer');
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Volunteer List</h2>

          {errorMessage && (
            <div className="bg-red-500 text-white p-3 mb-4 rounded-lg shadow">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-500 text-white p-3 mb-4 rounded-lg shadow">
              {successMessage}
            </div>
          )}

          <div className="mb-6 flex justify-between items-center">
            <Link
              to="/admin/volunteers/add"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
            >
              Add Volunteer
            </Link>
            <Link
              to="/admin/volunteers/attendance"
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
            >
              Volunteer Attendance
            </Link>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300 rounded-lg shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left font-medium text-gray-700">S.No</th>
                    <th className="p-3 text-left font-medium text-gray-700">Name</th>
                    <th className="p-3 text-left font-medium text-gray-700">Phone</th>
                    <th className="p-3 text-left font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((volunteer, index) => (
                    <tr key={volunteer._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-gray-700">{index + 1}</td>
                      <td className="p-3 text-gray-700">{volunteer.name}</td>
                      <td className="p-3 text-gray-700">{volunteer.phone}</td>
                      <td className="p-3 flex space-x-4">
                        <Link
                          to={`/admin/volunteers/edit/${volunteer._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(volunteer._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default VolunteerList;