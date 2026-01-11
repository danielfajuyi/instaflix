import { api } from './api';

// Auth functions
export const signUp = async (email, password) => {
  const { data } = await api.post('/auth/register', { email, password });
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export const signIn = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

export const signInWithGoogle = () => {
    // Redirect to backend Google Auth URL
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
}

export const signOut = async () => {
  localStorage.removeItem('token');
  // Optional: Call backend logout if you implement session invalidation
}

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const { data } = await api.get('/auth/me');
    return data;
  } catch (error) {
    console.error("Error fetching user", error);
    localStorage.removeItem('token'); // Clear invalid token
    return null;
  }
}