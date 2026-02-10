import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// THIS IS THE CRITICAL FIX: Attach the token to every request automatically
api.interceptors.request.use((config) => {
  // Check if we are in the browser
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Ensure the token has the "Bearer " prefix required by your middleware
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;