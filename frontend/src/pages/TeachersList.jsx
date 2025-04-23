import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Loader2 } from 'lucide-react'; // optional spinner icon from lucide-react

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Teachers List</h2>

        {errorMessage && (
          <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <div className="mb-4 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by name"
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link
            to="/admin/teachers/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Teacher
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
          </div>
        ) : (
          <table className="w-full text-sm border shadow-md bg-white">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border px-4 py-2">S.No</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Class</th>
                    <th className="border px-4 py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredTeachers.map((teacher, index) => (
                  <tr key={teacher._id}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{teacher.name}</td>
                      <td className="border px-4 py-2">
                          {teacher.classAssigned ? teacher.classAssigned.name : 'Not Assigned'}
                      </td>
                      <td className="border px-4 py-2 space-x-4">
                          <Link
                          to={`/admin/teachers/edit/${teacher._id}`}
                          className="text-blue-600 hover:underline"
                          >
                          Edit
                          </Link>
                          <button
                          onClick={() => handleDelete(teacher._id)}
                          className="text-red-600 hover:underline"
                          >
                          Delete
                          </button>
                      </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TeachersList;
