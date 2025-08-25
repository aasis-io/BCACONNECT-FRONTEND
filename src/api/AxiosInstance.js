// /src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor to catch token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401 && data?.error === "JWT access token expired") {
      // Remove expired token
      localStorage.removeItem("jwt");

      // Redirect to login and pass message in location state
      window.location.href = `/login?message=${encodeURIComponent(
        "Session expired. Please login again."
      )}`;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
