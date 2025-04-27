import React, { useState, useEffect } from "react";
import api from "../utils/api";
import AdminLayout from "../layouts/AdminLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const VolunteerAttendance = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [status, setStatus] = useState("present");
  const [date, setDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchVolunteers();
    fetchAttendanceRecords();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const res = await api.get("/admin/volunteers");
      setVolunteers(res.data);
    } catch (error) {
      setErrorMessage("Error fetching volunteers.");
    }
  };

  const groupRecordsByDate = (records) => {
    return records.reduce((acc, record) => {
      const date = new Date(record.date).toLocaleDateString(); // Format the date
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {});
  };

  const fetchAttendanceRecords = async () => {
    try {
      const res = await api.get("/admin/volunteers/attendance");
      const grouped = groupRecordsByDate(res.data); // Group records by date
      setAttendanceRecords(grouped); // Update state with grouped records
    } catch (error) {
      setErrorMessage("Error fetching attendance records.");
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/volunteers/attendance", {
        volunteerId: selectedVolunteer,
        date,
        status,
      });
      setSuccessMessage(res.data.message);
      setErrorMessage("");
      fetchAttendanceRecords(); // Refresh attendance records
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error marking attendance.");
      setSuccessMessage("");
    }
  };

  const deleteAttendance = async (attendanceId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");
      await api.delete(`/admin/volunteers/attendance/${attendanceId}`);
      setSuccessMessage("Attendance record deleted successfully.");
      fetchAttendanceRecords(); // Refresh attendance records
    } catch (err) {
      setErrorMessage("Failed to delete attendance record.");
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Volunteer Attendance Records", 14, 20);

    Object.keys(attendanceRecords).forEach((date) => {
      const records = attendanceRecords[date];

      // Prepare table data
      const tableData = records.map((record, idx) => [
        idx + 1,
        record.volunteer.name,
        record.status.charAt(0).toUpperCase() + record.status.slice(1),
      ]);

      // Add table for the date
      doc.autoTable({
        head: [["S.No", "Volunteer", "Status"]],
        body: tableData,
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 30,
        theme: "grid",
        margin: { top: 10 },
        didDrawPage: (data) => {
          doc.setFontSize(14);
          doc.text(`Date: ${date}`, 14, data.settings.startY - 10);
        },
      });
    });

    doc.save("Volunteer_Attendance_Records.pdf");
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
            Volunteer Attendance Management
          </h2>

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

          {/* Attendance Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Mark Attendance
            </h3>
            <form onSubmit={handleMarkAttendance}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volunteer
                  </label>
                  <select
                    value={selectedVolunteer}
                    onChange={(e) => setSelectedVolunteer(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a volunteer</option>
                    {volunteers.map((volunteer) => (
                      <option key={volunteer._id} value={volunteer._id}>
                        {volunteer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <DatePicker
                    selected={date}
                    onChange={(selectedDate) => setDate(selectedDate)}
                    dateFormat="yyyy-MM-dd"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholderText="Select a date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
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
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Mark Attendance
              </button>
            </form>
          </div>

          {/* Attendance Records */}
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            Attendance Records
          </h3>
{/* 
          <button
            onClick={exportToPDF}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 mb-6"
          >
            Export to PDF
          </button> */}

          <div>
            {Object.keys(attendanceRecords).map((date) => (
              <div key={date} className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-2">{date}</h4>
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 p-2 text-left">S.No</th>
                      <th className="border border-gray-300 p-2 text-left">Volunteer</th>
                      <th className="border border-gray-300 p-2 text-left">Status</th>
                      <th className="border border-gray-300 p-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords[date].map((record, idx) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2">{idx + 1}</td>
                        <td className="border border-gray-300 p-2">{record.volunteer.name}</td>
                        <td
                          className={`border border-gray-300 p-2 ${
                            record.status === "present" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
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

            {Object.keys(attendanceRecords).length === 0 && (
              <p className="text-gray-600 text-center mt-6">
                No attendance records found.
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default VolunteerAttendance;