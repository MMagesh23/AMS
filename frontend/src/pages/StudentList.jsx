import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../utils/api';

const gradeToLabel = (grade) => {
  if (grade === -1) return 'LKG';
  if (grade === 0) return 'UKG'; // Added UKG grade
  return `Grade ${grade}`;
};

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/admin/students', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        setErrorMessage('Error fetching students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    let filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.parent.toLowerCase().includes(term)
    );

    if (selectedGrade !== 'all') {
      filtered = filtered.filter((s) => `${s.grade}` === selectedGrade);
    }

    setFilteredStudents(filtered);
  }, [searchTerm, selectedGrade, students]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await api.delete(`/admin/students/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      setErrorMessage('Error deleting student');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const categorized = {
    Beginner: [],
    Primary: [],
    Junior: [],
    Inter: [],
  };

  filteredStudents.forEach((student) => {
    const grade = student.grade;
    if (grade === -1 || grade === 0 || (grade >= 1 && grade <= 2)) {
      categorized.Beginner.push(student);
    } else if (grade >= 3 && grade <= 5) {
      categorized.Primary.push(student);
    } else if (grade >= 6 && grade <= 8) {
      categorized.Junior.push(student);
    } else if (grade >= 9 && grade <= 12) {
      categorized.Inter.push(student);
    }
  });

  const renderStudentsByGrade = (group) => {
    const groupStudents = categorized[group];
    if (!groupStudents.length) return null;

    const groupedByGrade = {};
    groupStudents.forEach((student) => {
      const grade = student.grade;
      if (!groupedByGrade[grade]) groupedByGrade[grade] = [];
      groupedByGrade[grade].push(student);
    });

    Object.values(groupedByGrade).forEach((arr) => {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    });

    return (
      <div key={group} className="mb-8">
        <h3 className="text-2xl font-bold text-indigo-700 mb-4 border-b pb-1 border-indigo-300">
          {group}
        </h3>
        {Object.keys(groupedByGrade)
          .sort((a, b) => a - b)
          .map((gradeKey) => (
            <div key={gradeKey} className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                {gradeToLabel(parseInt(gradeKey))}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border shadow rounded-lg overflow-hidden">
                  <thead className="bg-indigo-100">
                    <tr>
                      <th className="border px-3 py-2">S.No</th>
                      <th className="border px-3 py-2">Name</th>
                      <th className="border px-3 py-2">Grade</th>
                      <th className="border px-3 py-2">Place</th>
                      <th className="border px-3 py-2">Parent</th>
                      <th className="border px-3 py-2">Phone</th>
                      <th className="border px-3 py-2">Update</th>
                      <th className="border px-3 py-2">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedByGrade[gradeKey].map((student, index) => (
                      <tr
                        key={student._id}
                        className="hover:bg-indigo-50 transition duration-200"
                      >
                        <td className="border px-3 py-2">{index + 1}</td>
                        <td className="border px-3 py-2">{student.name}</td>
                        <td className="border px-3 py-2">
                          {gradeToLabel(student.grade)}
                        </td>
                        <td className="border px-3 py-2">{student.place}</td>
                        <td className="border px-3 py-2">{student.parent}</td>
                        <td className="border px-3 py-2">{student.phone}</td>
                        <td className="border px-3 py-2">
                          <Link
                            to={`/admin/students/edit/${student._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            Update
                          </Link>
                        </td>
                        <td className="border px-3 py-2">
                          <button
                            onClick={() => handleDelete(student._id)}
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
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6">Student List</h2>

        {errorMessage && (
          <div className="bg-red-500 text-white p-3 mb-4 rounded-lg shadow">
            {errorMessage}
          </div>
        )}

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name or parent"
            className="px-4 py-2 w-full md:w-1/2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="all">All Grades</option>
            <option value="-1">LKG</option>
            <option value="0">UKG</option> {/* Added UKG grade */}
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Grade {i + 1}
              </option>
            ))}
          </select>
          <Link
            to="/admin/students/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-md"
          >
            Add Student
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
          </div>
        ) : (
          Object.keys(categorized).map((group) => renderStudentsByGrade(group))
        )}
      </div>
    </div>
  );
};

export default StudentList;
