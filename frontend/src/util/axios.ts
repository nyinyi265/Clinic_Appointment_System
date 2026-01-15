import axios from 'axios';
import { getStorage } from './storage';

const api = axios.create({
    baseURL: import.meta.env.VITE_API || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = getStorage().getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;