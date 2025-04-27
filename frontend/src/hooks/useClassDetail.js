import { useState, useEffect } from 'react';
import api from "../utils/api";

const useClassDetail = (classId) => {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!classId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/attendance/class-detail/${classId}`);
        setClassData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching class detail');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  return { classData, loading, error };
};

export default useClassDetail;
