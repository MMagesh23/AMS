import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import AdminLayout from '../layouts/AdminLayout';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TeacherAttendance = () => {
  const [teachers, setTeachers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [groupedRecords, setGroupedRecords] = useState({});
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [status, setStatus] = useState('present');
  const [date, setDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTeachers();
    fetchAttendanceRecords();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/admin/teachers');
      setTeachers(res.data);
    } catch (error) {
      setErrorMessage('Error fetching teachers');
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      const res = await api.get('/admin/teachers/attendance');
      const records = res.data;

      // Group records by date
      const grouped = records.reduce((acc, record) => {
        const date = new Date(record.date).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(record);
        return acc;
      }, {});

      setAttendanceRecords(records);
      setGroupedRecords(grouped);
    } catch (error) {
      setErrorMessage('Error fetching attendance records');
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/teachers/attendance', {
        teacherId: selectedTeacher,
        date,
        status,
      });
      setSuccessMessage(res.data.message);
      setErrorMessage('');
      fetchAttendanceRecords(); // Refresh attendance records
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error marking attendance');
      setSuccessMessage('');
    }
  };

  const deleteAttendance = async (attendanceId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");
      await api.delete(`/admin/teachers/attendance/${attendanceId}`);
      setSuccessMessage("Attendance record deleted successfully.");
      fetchAttendanceRecords(); // Refresh attendance records
    } catch (err) {
      setErrorMessage("Failed to delete attendance record.");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Teacher Attendance Management</h2>

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

          <form onSubmit={handleMarkAttendance} className="mb-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <DatePicker
              selected={date}
              onChange={(selectedDate) => setDate(selectedDate)}
              dateFormat="yyyy-MM-dd"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select a date"
            />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Mark Attendance
            </button>
          </form>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Attendance Records</h3>
          <div className="overflow-x-auto">
            {Object.keys(groupedRecords).map((date) => (
              <div key={date} className="mb-6">
                <h4 className="text-lg font-bold text-gray-700 mb-2">{date}</h4>
                <table className="w-full text-sm border border-gray-300 rounded-lg shadow">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left font-medium text-gray-700">S.No</th>
                      <th className="p-3 text-left font-medium text-gray-700">Teacher</th>
                      <th className="p-3 text-left font-medium text-gray-700">Status</th>
                      <th className="p-3 text-center font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedRecords[date].map((record, index) => (
                      <tr key={record._id} className="border-t hover:bg-gray-50">
                        <td className="p-3 text-gray-700">{index + 1}</td> {/* Serial Number */}
                        <td className="p-3 text-gray-700">{record.teacher.name}</td>
                        <td
                          className={`p-3 font-semibold ${
                            record.status === 'present' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => deleteAttendance(record._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TeacherAttendance;