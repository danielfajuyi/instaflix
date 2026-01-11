import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL;
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      console.error("Authentication failed:", error.response.data)
      // Token expired or invalid - could redirect to login here
    } else if (error.response?.status === 404) {
      console.error("Resource not found:", error.response.data);
    } else if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);