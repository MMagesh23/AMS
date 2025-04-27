import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Loader2, Settings } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";


const AttendanceManagement = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Analytics
  const totalStudents = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(
    (record) => record.status === "present"
  ).length;
  const absentCount = attendanceRecords.filter(
    (record) => record.status === "absent"
  ).length;
  const attendancePercentage =
    totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(2) : 0;

  // Fetch all classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/admin/classes");
        setClasses(res.data.classes);
      } catch (err) {
        setError("Failed to fetch classes.");
      }
    };

    fetchClasses();
  }, []);

  // Fetch attendance records for a specific class and date
  const fetchAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      setError("Please select a class and date.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Format the date in the local time zone (IST)
      const formattedDate = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

      const res = await api.get(
        `/admin/class/${selectedClass}/date/${formattedDate}`
      );
      setAttendanceRecords(res.data.students);
    } catch (err) {
      setError("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  };

  // Handle attendance status update
  const updateAttendance = async (attendanceId, newStatus, studentId) => {
    try {
      setLoading(true);
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      await api.put("/admin/update", {
        attendanceId,
        newStatus,
        studentId,
        classId: selectedClass,
        date: formattedDate,
      });
      fetchAttendance(); // Refresh attendance records
    } catch (err) {
      setError("Failed to update attendance.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAttendance = async (attendanceId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }
  
    try {
      setLoading(true);
      await api.delete(`/admin/attendance/${attendanceId}`);
      fetchAttendance(); // Refresh attendance records after deletion
    } catch (err) {
      setError("Failed to delete attendance record.");
    } finally {
      setLoading(false);
    }
  };

  const navigateToTimeWindow = () => {
    navigate("/admin/time-window");
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          📋 Attendance Management
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4 shadow">
            {error}
          </div>
        )}

        {/* Class and Date Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedClass || ""}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="" disabled>
                -- Select a Class --
              </option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholderText="Select a date"
            />
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={navigateToTimeWindow}
            className="flex items-center bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition duration-200 shadow-md"
          >
            <Settings className="h-5 w-5 mr-2" />
            Go to Set Time Window
          </button>
        </div>

        <button
          onClick={fetchAttendance}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 shadow-md"
        >
          {loading ? "Loading..." : "Fetch Attendance"}
        </button>

        {/* Analytics */}
        {attendanceRecords.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Attendance Analytics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium">Total Students</h3>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
              <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium">Present</h3>
                <p className="text-2xl font-bold">{presentCount}</p>
              </div>
              <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium">Absent</h3>
                <p className="text-2xl font-bold">{absentCount}</p>
              </div>
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium">Attendance %</h3>
                <p className="text-2xl font-bold">{attendancePercentage}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Records */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        ) : (
          attendanceRecords.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Attendance Records for {selectedDate?.toLocaleDateString()}
              </h2>
              <table className="w-full border text-sm bg-white rounded-lg shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left font-medium text-gray-700">
                      Student Name
                    </th>
                    <th className="p-3 text-left font-medium text-gray-700">
                      Status
                    </th>
                    <th className="p-3 text-left font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr
                      key={record.studentId}
                      className="border-t hover:bg-gray-50 transition duration-200"
                    >
                      <td className="p-3 text-gray-800">{record.name}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            record.status === "present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() =>
                            updateAttendance(
                              record.attendanceId,
                              record.status === "present"
                                ? "absent"
                                : "present",
                              record.studentId
                            )
                          }
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-200"
                        >
                          Mark as {record.status === "present" ? "Absent" : "Present"}
                        </button>
                        <button
                            onClick={() => deleteAttendance(record.attendanceId)}
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
          )
        )}

        {attendanceRecords.length === 0 && !loading && selectedClass && (
          <p className="text-gray-600 mt-6 text-center">
            No attendance records found.
          </p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AttendanceManagement;
