import React from 'react';
import useClassDetail from '../hooks/useClassDetail';

const ClassAttendanceDetail = ({ classId }) => {
  const { classData, loading, error } = useClassDetail(classId);

  if (loading) return <p>Loading class attendance...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-2">
        {classData.className} - Teacher: {classData.teacher}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1 border">Student</th>
              {classData.students[0]?.attendance.map((day, i) => (
                <th key={i} className="px-2 py-1 border text-sm">{new Date(day.date).toLocaleDateString()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classData.students.map((student) => (
              <tr key={student.studentId}>
                <td className="border px-2 py-1">{student.name}</td>
                {student.attendance.map((a, idx) => (
                  <td
                  onClick={() => {
                    if (!editableRows[student.studentId]) {
                      setEditableRows({ ...editableRows, [student.studentId]: true });
                    } else {
                      // Toggle status
                      const newStatus =
                        updatedRecords[student.studentId]?.[record.date]?.status === 'present'
                          ? 'absent'
                          : 'present';
                
                      setUpdatedRecords(prev => ({
                        ...prev,
                        [student.studentId]: {
                          ...(prev[student.studentId] || {}),
                          [record.date]: {
                            ...record,
                            status: newStatus,
                          },
                        },
                      }));
                    }
                  }}
                  className={`cursor-pointer p-2 border text-center ${
                    updatedRecords[student.studentId]?.[record.date]?.status === 'present' ||
                    record.status === 'present'
                      ? 'bg-green-100 text-green-800'
                      : record.status === 'absent' ||
                        updatedRecords[student.studentId]?.[record.date]?.status === 'absent'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {updatedRecords[student.studentId]?.[record.date]?.status ||
                    record.status ||
                    '-'}
                </td>
                
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassAttendanceDetail;
