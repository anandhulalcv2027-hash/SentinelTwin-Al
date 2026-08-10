import axios from 'axios';
import { tokenStore } from './tokenStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

// Axios instance — all requests go through here.
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token on every request if one exists.
api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Normalise error messages from the FastAPI detail field.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail;
      if (typeof detail === 'string') {
        error.message = detail;
      } else if (Array.isArray(detail) && detail.length > 0) {
        // Pydantic validation errors have {loc, msg} shape
        error.message = detail.map((d: { msg: string }) => d.msg).join(', ');
      }
    }
    return Promise.reject(error);
  },
);

export default api;
