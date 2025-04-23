import { useEffect, useState } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const AssignTeacher = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ classId: '', teacherId: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, teacherRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/teachers'),
        ]);
        setClasses(Object.values(classRes.data).flat());
        setTeachers(teacherRes.data);
      } catch (error) {
        toast.error('Failed to load classes or teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    const selectedTeacher = teachers.find(t => t._id === formData.teacherId);
    const currentClass = classes.find(cls => cls.classId === formData.classId);

    if (selectedTeacher?.classAssigned && selectedTeacher.classAssigned !== formData.classId) {
      const confirm = window.confirm(
        `This teacher is already assigned to a class. Do you want to reassign them to ${currentClass?.name}?`
      );
      if (!confirm) return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/admin/classes/assign-teacher', formData);
      toast.success(res.data.message || 'Teacher assigned successfully');
      setFormData({ classId: '', teacherId: '' });
      setSelectedClass(null);

      // Refresh data after assignment
      const [updatedClasses, updatedTeachers] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/teachers'),
      ]);
      setClasses(Object.values(updatedClasses.data).flat());
      setTeachers(updatedTeachers.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error assigning teacher');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setFormData({ ...formData, classId });
    const foundClass = classes.find(cls => cls.classId === classId);
    setSelectedClass(foundClass || null);
  };

  return (
    <motion.div
      className="p-6 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6">Assign Teacher to Class</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading classes and teachers...</div>
      ) : (
        <form onSubmit={handleAssign} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Select Class</label>
            <select
              value={formData.classId}
              onChange={handleClassChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">-- Choose Class --</option>
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <option key={cls.classId} value={cls.classId}>
                    {cls.name}
                  </option>
                ))
              ) : (
                <option disabled>No classes available</option>
              )}
            </select>

            {selectedClass?.teacher && (
              <p className="text-sm text-gray-500 mt-1">
                Current Teacher: {
                  teachers.find(t => t._id === selectedClass.teacher)?.name || 'Unknown'
                }
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Select Teacher</label>
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">-- Choose Teacher --</option>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name} {teacher.classAssigned && ` (Assigned)`}
                  </option>
                ))
              ) : (
                <option disabled>No teachers available</option>
              )}
            </select>
          </div>

          <button
            type="submit"
            className={`w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={submitting}
          >
            {submitting ? 'Assigning...' : 'Assign Teacher'}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default AssignTeacher;
