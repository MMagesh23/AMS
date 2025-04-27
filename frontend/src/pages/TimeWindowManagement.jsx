import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import AdminLayout from '../layouts/AdminLayout';

const TimeWindowManagement = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTimeWindow = async () => {
      try {
        const res = await api.get('/admin/time-window');
        setStartTime(res.data.startTime);
        setEndTime(res.data.endTime);
      } catch (err) {
        console.error('Failed to fetch time window:', err);
      }
    };

    fetchTimeWindow();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/time-window', { startTime, endTime });
      setMessage('Time window updated successfully!');
    } catch (err) {
      console.error('Failed to update time window:', err);
      setMessage('Failed to update time window.');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Set Attendance Submission Time Window</h1>
        {message && <p className="mb-4 text-green-600">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default TimeWindowManagement;