import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Loader2 } from 'lucide-react';
import AdminLayout from "../layouts/AdminLayout";

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/admin/teachers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTeachers(res.data);
      setFilteredTeachers(res.data);
    } catch (error) {
      setErrorMessage('Error fetching teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredTeachers(
      teachers.filter((t) => t.name.toLowerCase().includes(term))
    );
  }, [searchTerm, teachers]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;

    try {
      await api.delete(`/admin/teachers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      setErrorMessage('Error deleting teacher');
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-indigo-800 mb-6">Teachers List</h2>

          {errorMessage && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow mb-4">
              {errorMessage}
            </div>
          )}

          <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Search by name"
              className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link
              to="/admin/teachers/add"
              className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              Add Teacher
            </Link>
            <Link
              to="/admin/class-management/assign-teacher"
              className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              Assign Teacher to Class
            </Link>
            <Link
              to="/admin/teachers/attendance"
              className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gradient-to-br focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              Teacher Attendance
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border shadow-md bg-white rounded-lg overflow-hidden">
                <thead className="bg-indigo-100 text-indigo-800">
                  <tr>
                    <th className="border px-4 py-2">S.No</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Phone</th>
                    <th className="border px-4 py-2">Class</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher, index) => (
                    <tr key={teacher._id} className="hover:bg-indigo-50 transition duration-200">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{teacher.name}</td>
                      <td className="border px-4 py-2">{teacher.phone}</td>
                      <td className="border px-4 py-2">
                        {teacher.classAssigned ? teacher.classAssigned.name : 'Not Assigned'}
                      </td>
                      <td className="border px-4 py-2 space-x-4">
                        <Link to={`/admin/teachers/edit/${teacher._id}`} className="text-blue-600 hover:underline">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(teacher._id)}
                          className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
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

export default TeachersList;