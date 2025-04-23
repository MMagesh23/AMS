import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import AssignTeacher from './AssignTeacher';
import AllocateStudents from './AllocateStudents';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await api.get('/admin/dashboard');
    const all = [];
    Object.values(res.data).forEach(group => all.push(...group));
    setClasses(all);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Existing Classes</h2>
      <select
        onChange={(e) => {
          const cls = classes.find(c => c.classId === e.target.value);
          setSelectedClass(cls);
        }}
        className="border p-2 mb-4 w-full"
      >
        <option value="">Select Class</option>
        {classes.map(cls => (
          <option key={cls.classId} value={cls.classId}>
            {cls.name} ({cls.teacher || 'No teacher'})
          </option>
        ))}
      </select>

      {selectedClass && (
        <>
          <AssignTeacher selectedClass={selectedClass} refresh={fetchClasses} />
          <AllocateStudents selectedClass={selectedClass} refresh={fetchClasses} />
        </>
      )}
    </div>
  );
};

export default ManageClasses;
