import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeacherAttendance = () => {
  const [assignedClass, setAssignedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAssignedClass = async () => {
      try {
        const res = await axios.get('/api/teacher/assigned-class');
        const data = res.data;
        if (data) {
          setAssignedClass(data);
          setStudents(data.students || []);
          const initialAttendance = {};
          (data.students || []).forEach((s) => {
            initialAttendance[s._id] = true;
          });
          setAttendance(initialAttendance);
        }
      } catch (err) {
        console.error('Error fetching assigned class:', err);
      }
    };

    fetchAssignedClass();
  }, []);

  const handleAttendanceChange = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSubmit = async () => {
    try {
      const presentStudents = Object.entries(attendance)
        .filter(([_, present]) => present)
        .map(([id]) => id);

      await axios.post('/api/teacher/submit-attendance', {
        classId: assignedClass._id,
        date,
        presentStudents,
      });

      setMessage('Attendance submitted successfully.');
    } catch (err) {
      console.error('Error submitting attendance:', err);
      setMessage('Error submitting attendance.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Take Attendance</h1>

      {assignedClass ? (
        <>
          <p className="mb-2"><strong>Class:</strong> {assignedClass.className}</p>

          <div className="mb-4">
            <label className="block mb-1">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>

          <h2 className="text-xl font-semibold mb-2">Students</h2>
          {students.length > 0 ? (
            <ul className="space-y-2">
              {students.map((student) => (
                <li key={student._id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span>{student.name}</span>
                  <input
                    type="checkbox"
                    checked={attendance[student._id] || false}
                    onChange={() => handleAttendanceChange(student._id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No students found for this class.</p>
          )}

          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Submit Attendance
          </button>

          {message && <p className="mt-2 text-green-600">{message}</p>}
        </>
      ) : (
        <p>No assigned class found.</p>
      )}
    </div>
  );
};

export default TeacherAttendance;
