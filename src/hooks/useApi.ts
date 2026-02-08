// src/services/api.ts (or wherever you init axios)
import axios from 'axios';

const api = axios.create({
  baseURL:process.env.NEXT_PUBLIC_API_BASE_URL, // Your Node Backend URL
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;