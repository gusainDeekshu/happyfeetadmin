import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Uploads image to YOUR Backend (which sends it to Cloudinary)
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  // Send to POST /api/upload
  const { data } = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.url; // Returns the Cloudinary URL
};

// Optional: Helper to delete (if you implemented delete on backend)
export const deleteImage = async (public_id: string) => {
  await api.post('/upload/delete', { public_id });
};
// Request interceptor to add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // We only access localStorage in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;