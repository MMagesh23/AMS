import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/teacher',
});

// Automatically attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // 👈 stored after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
