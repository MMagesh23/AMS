import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from "../utils/api";

import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const AllocateStudents = ({ classId, classCategory, assignedStudentIds = [], onAllocationComplete }) => {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/admin/students');
        const eligible = res.data.filter(
          (s) => s.grade === classCategory && (!s.classAssigned || s.classAssigned !== classId)
        );
        setStudents(eligible);
      } catch (err) {
        toast.error('Failed to fetch students');
      }
    };
    fetchStudents();
  }, [classCategory, classId]);

  const toggleSelection = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleAllocate = async () => {
    if (selected.length === 0) return toast.error('Select at least one student');
    setLoading(true);
    try {
      const res = await api.post(`/admin/allocate/${classId}`, {
        studentIds: selected,
      });

      const { message, skipped } = res.data;

      if (message) toast.success(message);
      if (skipped && skipped.length > 0) {
        skipped.forEach((s) => {
          toast.error(`${s.name || 'Student'} skipped: ${s.reason}`);
        });
      }

      setSelected([]);
      onAllocationComplete?.();
    } catch (err) {
      toast.error('Allocation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold">Allocate Students</h2>

      <div className="border rounded-lg max-h-80 overflow-y-auto p-4 bg-white shadow">
        {students.length === 0 ? (
          <p className="text-sm text-gray-500">No eligible students found.</p>
        ) : (
          students.map((student) => (
            <div
              key={student._id}
              onClick={() => toggleSelection(student._id)}
              className={`cursor-pointer p-3 rounded border mb-2 transition ${
                selected.includes(student._id)
                  ? 'bg-blue-100 border-blue-500'
                  : 'hover:bg-gray-100 border-gray-300'
              }`}
            >
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-gray-500">Grade: {student.grade}</p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleAllocate}
        disabled={loading || selected.length === 0}
        className={`w-full py-2 px-4 rounded text-white font-semibold ${
          loading || selected.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Allocating...' : `Allocate ${selected.length} Student(s)`}
      </button>
    </motion.div>
  );
};

export default AllocateStudents;
