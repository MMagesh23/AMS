// utils/attendanceHelpers.js
const countPresentStudents = (classId, attendanceRecords) =>
    attendanceRecords.filter(
      r => r.classId?.toString() === classId && r.status === 'Present'
    ).length;
  
  const calculateAttendancePercentage = (present, total) =>
    total ? Math.round((present / total) * 100) : 0;
  
  const groupClassesByCategory = (classes) => {
    return classes.reduce((acc, cls) => {
      const cat = cls.category || 'Uncategorized';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(cls);
      return acc;
    }, {});
  };
  
  module.exports = {
    countPresentStudents,
    calculateAttendancePercentage,
    groupClassesByCategory
  };
  