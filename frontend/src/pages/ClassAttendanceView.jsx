import React, { useEffect, useState } from "react";
import api from "../utils/api";

const ClassAttendanceView = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [classDetail, setClassDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await api.get("/admin/dashboard");
    const all = [];
    Object.values(res.data).forEach((group) => all.push(...group));
    setClasses(all);
  };

  const fetchClassDetail = async (classId) => {
    setIsLoading(true);
    const res = await api.get(`/admin/dashboard/class/${classId}`);
    setClassDetail(res.data);
    setIsLoading(false);
  };

  const modifyAttendance = async (attendanceId, status) => {
    await api.post("/admin/attendance/modify", {
      attendanceId,
      status,
    });
    fetchClassDetail(selectedClassId); // refresh after update
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Class Attendance Overview</h2>

      <select
        onChange={(e) => {
          setSelectedClassId(e.target.value);
          fetchClassDetail(e.target.value);
        }}
        className="border border-gray-300 p-2 rounded mb-4"
      >
        <option value="">Select a Class</option>
        {classes.map((cls) => (
          <option key={cls.classId} value={cls.classId}>
            {cls.name} ({cls.teacher || "No teacher"})
          </option>
        ))}
      </select>

      {isLoading && <p>Loading...</p>}

      {classDetail && (
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Class: {classDetail.className}
          </h3>
          <p className="mb-4">Teacher: {classDetail.teacher}</p>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Student</th>
                  {classDetail.students[0]?.attendance.map((day) => (
                    <th key={day.date} className="border px-2 py-1 text-sm">
                      {day.date.slice(5)} {/* Show MM-DD */}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classDetail.students.map((student) => (
                  <tr key={student.studentId} className="text-center">
                    <td className="border px-4 py-2 font-medium text-left">
                      {student.name}
                    </td>
                    {student.attendance.map((day) => (
                      <td
                        key={day.date}
                        className={`border px-2 py-1 ${
                          day.status === "Present"
                            ? "bg-green-100 text-green-800"
                            : day.status === "Absent"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {day.status || "-"}
                        {day._id && (
                          <div className="text-xs mt-1">
                            <button
                              className="text-green-600 underline mr-1"
                              onClick={() =>
                                modifyAttendance(day._id, "Present")
                              }
                            >
                              P
                            </button>
                            <button
                              className="text-red-600 underline"
                              onClick={() =>
                                modifyAttendance(day._id, "Absent")
                              }
                            >
                              A
                            </button>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassAttendanceView;
