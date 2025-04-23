import React, { useState, useEffect } from 'react';

const EditStudentModal = ({ student, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(student);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await api.put(`/admin/students/${student._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      onUpdate(response.data.student);
      onClose();
    } catch (error) {
      console.error('Error updating student', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Edit Student</h2>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mb-2 w-full border p-1" />
        <input type="text" name="grade" value={formData.grade === -1 ? 'LKG' : formData.grade} onChange={handleChange} className="mb-2 w-full border p-1" />
        <input type="text" name="place" value={formData.place} onChange={handleChange} className="mb-2 w-full border p-1" />
        <input type="text" name="parent" value={formData.parent} onChange={handleChange} className="mb-2 w-full border p-1" />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mb-4 w-full border p-1" />
        <div className="flex justify-between">
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-1 rounded">Update</button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-1 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;
