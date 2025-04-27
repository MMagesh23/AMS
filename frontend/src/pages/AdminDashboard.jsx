import React, { useEffect, useState } from "react";
import { Download, Users, User, ClipboardList } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../utils/api";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalVolunteers: 0,
    studentAttendance: { present: 0, total: 0, percentage: 0 },
    teacherAttendance: { present: 0, total: 0, percentage: 0 },
    volunteerAttendance: { present: 0, total: 0, percentage: 0 },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch analytics data from the backend
        const res = await api.get("/admin/dashboard/analytics");
        setAnalytics(res.data);
      } catch (err) {
        setError("Failed to fetch analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const exportPDF = (section) => {
    // Implement PDF export logic here
    console.log(`Exporting ${section} data to PDF...`);
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          📊 Admin Dashboard
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4 shadow">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 text-blue-600">Loading...</div>
          </div>
        ) : (
          <>
            {/* First Section: Total Counts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium">Total Students</h3>
                <p className="text-2xl font-bold">{analytics.totalStudents}</p>
              </div>
              <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium">Total Teachers</h3>
                <p className="text-2xl font-bold">{analytics.totalTeachers}</p>
              </div>
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium">Total Volunteers</h3>
                <p className="text-2xl font-bold">{analytics.totalVolunteers}</p>
              </div>
            </div>

            {/* Second Section: Today's Attendance */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Today's Attendance
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium">Students Present</h3>
                  <p className="text-2xl font-bold">
                    {analytics.studentAttendance?.present || 0} /{" "}
                    {analytics.studentAttendance?.total || 0}
                  </p>
                  <p className="text-sm">
                    {analytics.studentAttendance?.percentage || 0}% Present
                  </p>
                </div>
                <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium">Teachers Present</h3>
                  <p className="text-2xl font-bold">
                    {analytics.teacherAttendance?.present || 0} /{" "}
                    {analytics.teacherAttendance?.total || 0}
                  </p>
                  <p className="text-sm">
                    {analytics.teacherAttendance?.percentage || 0}% Present
                  </p>
                </div>
                <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium">Volunteers Present</h3>
                  <p className="text-2xl font-bold">
                    {analytics.volunteerAttendance?.present || 0} /{" "}
                    {analytics.volunteerAttendance?.total || 0}
                  </p>
                  <p className="text-sm">
                    {analytics.volunteerAttendance?.percentage || 0}% Present
                  </p>
                </div>
              </div>
              <button
                onClick={() => exportPDF("Today's Attendance")}
                className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition duration-200 shadow-md flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Export PDF
              </button>
            </div>

            {/* Third Section: Cumulative Data */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Cumulative Data (Till Date)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium">Total Students</h3>
                  <p className="text-2xl font-bold">{analytics.totalStudents}</p>
                </div>
                <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium">Total Teachers</h3>
                  <p className="text-2xl font-bold">{analytics.totalTeachers}</p>
                </div>
                <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium">Total Volunteers</h3>
                  <p className="text-2xl font-bold">{analytics.totalVolunteers}</p>
                </div>
              </div>
              <button
                onClick={() => exportPDF("Cumulative Data")}
                className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition duration-200 shadow-md flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Export PDF
              </button>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;