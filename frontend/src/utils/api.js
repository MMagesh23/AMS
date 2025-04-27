import axios from "axios";

const api = axios.create({
  baseURL: "https://vbs-sms-api.vercel.app/api", // http://localhost:5000/api
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request interceptor to add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle invalid token
api.interceptors.response.use(
  (response) => {
    // If the response is successful, return it
    return response;
  },
  (error) => {
    // If the response has an error
    if (error.response && error.response.status === 401) {
      // If the token is invalid, clear the token and redirect to login
      localStorage.removeItem("token"); // Clear the token
      window.location.href = "/admin-login"; // Redirect to login page
    }
    return Promise.reject(error); // Reject the promise with the error
  }
);

export default api;
