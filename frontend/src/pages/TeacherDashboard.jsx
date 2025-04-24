import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const TeacherDashboard = () => {
  const [classInfo, setClassInfo] = useState(null);
  const [teacherName, setTeacherName] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingClassInfo, setLoadingClassInfo] = useState(true);
  const [loadingAttendanceRecords, setLoadingAttendanceRecords] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Calculate time remaining for the attendance window
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const endTime = new Date();
      endTime.setHours(13, 0, 0, 0); // 1:00 PM

      const timeDiff = endTime - now;

      if (timeDiff > 0) {
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);
        setTimeRemaining({ hours, minutes, seconds });
      } else {
        setTimeRemaining(null); // Time window has passed
      }
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoadingClassInfo(true);
        const res = await api.get("/teacher/assigned-class", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setClassInfo(res.data);
        setTeacherName(res.data.teacherName || "Not Assigned");
        const initial = {};
        res.data.students.forEach((student) => {
          initial[student._id] = "present";
        });
        setAttendance(initial);
      } catch (err) {
        setError("Failed to fetch class data.");
      } finally {
        setLoadingClassInfo(false);
      }
    };

    fetchClassData();
  }, []);

  useEffect(() => {
    const fetchPastAttendance = async () => {
      try {
        setLoadingAttendanceRecords(true);
        const res = await api.get("/teacher/past-attendance", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAttendanceRecords(res.data); // Update state with the latest attendance records
      } catch (err) {
        setError("Failed to fetch past attendance records.");
      } finally {
        setLoadingAttendanceRecords(false);
      }
    };

    fetchPastAttendance();
  }, []); // Fetch attendance data when the component loads

  const handleChange = (id, status) => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const now = new Date();
      const startTime = new Date();
      startTime.setHours(10, 0, 0, 0); // 10:00 AM
      const endTime = new Date();
      endTime.setHours(13, 0, 0, 0); // 1:00 PM

      if (now < startTime || now > endTime) {
        toast.error("Attendance can only be submitted between 10 AM and 1 PM.");
        return;
      }

      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status,
      }));

      await api.post(
        "/teacher/submit-attendance",
        { records },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Attendance submitted successfully!");
      setAttendanceStatus(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error submitting attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const grouped = attendanceRecords.reduce((acc, curr) => {
    const date = new Date(curr.date).toLocaleDateString();
    acc[date] = acc[date] || [];
    acc[date].push(curr);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  const handleDayClick = (index) => {
    const dateKey = sortedDates[index];
    setSelectedDay({ day: `Day ${sortedDates.length - index}`, date: dateKey });
    setSelectedRecords(grouped[dateKey]);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-700">📘 Teacher Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 text-sm sm:text-base"
        >
          Logout
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2">Teacher: {teacherName}</h2>
        {classInfo && (
          <>
            <h3 className="text-md font-medium text-gray-600 mb-2">Class: {classInfo.className}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">S.No</th>
                    <th className="p-2 text-left">Student</th>
                    <th className="p-2 text-left">STD</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Parent</th>
                    <th className="p-2 text-left">Place</th>
                    <th className="p-2 text-left">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {classInfo.students.map((student, index) => (
                    <tr key={student._id} className="border-t">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.grade}</td>
                      <td className="p-2">
                          <label className="mr-4">
                            <input
                              type="radio"
                              name={`status-${student._id}`}
                              value="present"
                              checked={attendance[student._id] === "present"}
                              onChange={() => handleChange(student._id, "present")}
                              disabled={attendanceStatus || !timeRemaining} // Disable if time window is closed
                              className="mr-1"
                            />
                            Present
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`status-${student._id}`}
                              value="absent"
                              checked={attendance[student._id] === "absent"}
                              onChange={() => handleChange(student._id, "absent")}
                              disabled={attendanceStatus || !timeRemaining} // Disable if time window is closed
                              className="mr-1"
                            />
                            Absent
                          </label>
                      </td>
                      <td className="p-2">{student.parent}</td>
                      <td className="p-2">{student.place}</td>
                      <td className="p-2">{student.phone}</td>                   
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {timeRemaining ? (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4 text-sm">
          ⏳ Attendance submission window closes in:{" "}
          <strong>
            {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
          </strong>
        </div>
      ) : (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-sm">
          ❌ Attendance submission window has closed.
        </div>
      )}

      {!attendanceStatus && classInfo && timeRemaining && (
        <div className="bg-green-50 p-4 rounded-xl shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-3 text-green-800">📝 Mark Attendance</h2>
          <button
            onClick={handleSubmit}
            className={`w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      )}

      {attendanceStatus && (
        <p className="text-green-600 font-medium mb-6 text-sm sm:text-base">
          ✅ Attendance already submitted for today.
        </p>
      )}

      {loadingAttendanceRecords ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">📅 Past Attendance (Most Recent First)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {sortedDates.map((date, idx) => (
              <button
                key={date}
                onClick={() => handleDayClick(idx)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-xl shadow-sm transition text-sm"
                title={date}
              >
                Day {sortedDates.length - idx}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative"
            >
              <button
                onClick={() => setSelectedDay(null)}
                className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4 text-blue-700">
                {selectedDay.day} - {selectedDay.date}
              </h3>
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-2">Student Name</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRecords.map((record) => (
                      <tr key={record._id} className="border-t">
                        <td className="p-2">{record.student?.name || "Unknown"}</td>
                        <td className="p-2">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherDashboard;