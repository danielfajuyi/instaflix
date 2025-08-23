import axios from "axios";
import { supabase } from "./auth";

// const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const baseURL = import.meta.env.VITE_API_BASE_URL;
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // You can add auth headers here if needed
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      }
    } catch (error) {
      console.error('Error getting session:', error)
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
      // Token expired or invalid, redirect to login
      console.error("Authentication failed:", error.response.data)
      // You could dispatch a logout action here or redirect to login
    } else if (error.response?.status === 404) {
      console.error("Resource not found:", error.response.data);
    } else if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);
