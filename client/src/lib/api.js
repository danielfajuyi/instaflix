import axios from "axios";
import { supabase } from "./auth";

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
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
        console.log('Adding auth token to request:', config.url) // Debug log
      } else {
        console.warn('No session found for request:', config.url) // Debug log
      }
    } catch (error) {
      console.error('Error getting session for API request:', error)
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