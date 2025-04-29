import React, { useEffect, useState } from 'react';
import { jsPDF } from "jspdf"; // Import jsPDF
import api from "../utils/api";
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import AdminLayout from "../layouts/AdminLayout";

const gradeToLabel = (grade) => {
  if (grade === -1) return 'LKG';
  if (grade === 0) return 'UKG';
  return `Grade ${grade}`;
};

const ClassDetail = () => {
  const { id: classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, studentId: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassDetails();
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      const { data } = await api.get(`/admin/classes/${classId}`);
      setClassData(data);
      setStudents(data.students || []);
      fetchAvailableStudents(data.category);
    } catch (err) {
      toast.error('Failed to fetch class data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableStudents = async (category) => {
    try {
      const { data } = await api.get('/admin/students');
      const filtered = data.filter(
        (student) => student.category === category && !student.classAssigned
      );
      setAvailableStudents(filtered);
    } catch (err) {
      toast.error('Error fetching available students');
    }
  };

  const allocateStudents = async () => {
    try {
      await api.post(`/admin/classes/${classId}/allocate-students`, {
        studentIds: selectedStudents,
      });
      toast.success('Students allocated');
      setSelectedStudents([]);
      setShowModal(false);
      fetchClassDetails();
    } catch (err) {
      toast.error('Allocation failed');
    }
  };

  const removeStudent = async () => {
    try {
      await api.patch(`/admin/classes/${classId}/remove-student`, {
        studentId: deleteModal.studentId,
      });
      toast.success('Student removed');
      setDeleteModal({ show: false, studentId: null });
      fetchClassDetails();
    } catch (err) {
      toast.error('Failed to remove student');
    }
  };

  // Function to export class details and student list to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add class details
    doc.setFontSize(16);
    doc.text(`${classData.name} (${classData.category})`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Teacher: ${classData.teacher?.name || 'Unassigned'}`, 10, 20);

    // Add table header
    doc.setFontSize(14);
    doc.text("Student List", 10, 30);
    doc.setFontSize(10);
    doc.text("S.No", 10, 40);
    doc.text("Name", 30, 40);
    doc.text("STD", 80, 40);
    doc.text("Place", 110, 40);
    doc.text("Parent", 140, 40);
    doc.text("Phone", 180, 40);

    // Add student data
    let y = 50;
    students.forEach((student, index) => {
      doc.text(`${index + 1}`, 10, y);
      doc.text(student.name, 30, y);
      doc.text(gradeToLabel(student.grade), 80, y);
      doc.text(student.place, 110, y);
      doc.text(student.parent, 140, y);
      doc.text(student.phone, 180, y);
      y += 10;
    });

    // Save the PDF
    doc.save(`${classData.name}_Student_List.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        className="p-6 max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-indigo-800">
            {classData.name} ({classData.category})
          </h1>
          <p className="text-gray-600 mt-2">
            <span className="font-semibold">Teacher:</span> {classData.teacher?.name || 'Unassigned'}
          </p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Students</h2>
          <div className="flex gap-4">
            <button
              className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-800 transition"
              onClick={() => setShowModal(true)}
            >
              Add Students
            </button>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-800 transition"
              onClick={exportToPDF}
            >
              Export to PDF
            </button>
          </div>
        </div>

        {students.length === 0 ? (
          <p className="text-gray-500 text-lg">No students assigned to this class.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg shadow-md">
            <table className="min-w-full text-left">
              <thead className="bg-indigo-100 text-indigo-800">
                <tr>
                  <th className="px-4 py-2">S.No</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">STD</th>
                  <th className="px-4 py-2">Place</th>
                  <th className="px-4 py-2">Parent</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">{gradeToLabel(student.grade)}</td>
                    <td className="px-4 py-2">{student.place}</td>
                    <td className="px-4 py-2">{student.parent}</td>
                    <td className="px-4 py-2">{student.phone}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => setDeleteModal({ show: true, studentId: student._id })}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Students Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
              <h3 className="text-xl font-bold mb-4 text-indigo-800">Select Students</h3>

              <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
                {availableStudents.map((student) => (
                  <label key={student._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={student._id}
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        setSelectedStudents((prev) =>
                          checked
                            ? [...prev, value]
                            : prev.filter((id) => id !== value)
                        );
                      }}
                    />
                    <span>{student.name}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedStudents([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={allocateStudents}
                  disabled={selectedStudents.length === 0}
                >
                  Allocate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
            >
              <h3 className="text-xl font-bold text-red-600 mb-4">Confirm Removal</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove this student? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setDeleteModal({ show: false, studentId: null })}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={removeStudent}
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default ClassDetail;
