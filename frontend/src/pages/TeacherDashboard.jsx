import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Loader2 } from "lucide-react";

const TeacherDashboard = () => {
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [pastAttendance, setPastAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await api.get("/teacher/assigned-class");
        setClassName(classRes.data.className);
        setStudents(classRes.data.students);

        const checkRes = await api.get("/teacher/check-today");
        setSubmitted(checkRes.data.submitted);

        const pastRes = await api.get("/teacher/past-attendance");
        setPastAttendance(pastRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    const records = students.map((s) => ({
      studentId: s._id,
      status: attendance[s._id] || "absent",
    }));

    try {
      await api.post("/teacher/submit-attendance", { records });
      alert("Attendance submitted successfully");
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit attendance");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Class: {className || "Not Assigned"}
      </h1>

      {!submitted ? (
        <>
          <h2 className="text-lg font-semibold text-blue-600 mb-3">
            Mark Today's Attendance
          </h2>
          <div className="space-y-3">
            {students.map((student) => (
              <div
                key={student._id}
                className="flex items-center justify-between p-3 bg-white shadow rounded"
              >
                <span className="text-gray-700">{student.name}</span>
                <select
                  className="border rounded px-2 py-1"
                  value={attendance[student._id] || "absent"}
                  onChange={(e) =>
                    handleAttendanceChange(student._id, e.target.value)
                  }
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded transition"
          >
            Submit Attendance
          </button>
        </>
      ) : (
        <div className="bg-green-100 text-green-700 p-4 rounded shadow">
          ✅ Attendance has already been submitted today.
        </div>
      )}

      <hr className="my-8" />

      <h2 className="text-lg font-semibold text-gray-800 mb-2">Past Attendance</h2>
      {pastAttendance.length === 0 ? (
        <p className="text-gray-500">No past attendance records found.</p>
      ) : (
        <div className="space-y-2">
          {pastAttendance.map((record) => (
            <div
              key={record._id}
              className="bg-gray-50 border p-3 rounded shadow-sm text-sm flex justify-between"
            >
              <span>{record.date}</span>
              <span>{record.student.name}</span>
              <span
                className={`font-semibold ${
                  record.status === "present" ? "text-green-600" : "text-red-500"
                }`}
              >
                {record.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
