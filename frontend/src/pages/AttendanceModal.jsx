import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AttendanceModal = ({ classId, date, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get(`/admin/attendance/class/${classId}/date/${date}`);
        const formatted = res.data.map((record) => ({
          attendanceId: record._id,
          studentId: record.student._id,
          name: record.student.name,
          status: record.status,
        }));
        setStudents(formatted);
      } catch (err) {
        console.error('Failed to fetch class attendance', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [classId, date]);

  const toggleStatus = (studentId) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId
          ? {
              ...s,
              status: s.status === 'present' ? 'absent' : 'present',
            }
          : s
      )
    );
  };

  const saveChanges = async () => {
    setSubmitting(true);
    try {
      for (let s of students) {
        await api.put('/admin/attendance/update', {
          attendanceId: s.attendanceId,
          status: s.status,
        });
      }
      onClose(); // close modal after save
    } catch (err) {
      console.error('Failed to update attendance', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Attendance – {new Date(date).toDateString()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : students.length === 0 ? (
          <p>No attendance records found for this class on this date.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.studentId} className="border-b">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2 capitalize">
                    {s.status === 'present' ? 'Present ✅' : 'Absent ❌'}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => toggleStatus(s.studentId)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-6 flex justify-end">
          <button
            disabled={submitting}
            onClick={saveChanges}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
