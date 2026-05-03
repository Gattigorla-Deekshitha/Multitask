import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const projectService = {
    getAll: () => api.get('/projects/'),
    getById: (id) => api.get(`/projects/${id}/`),
    create: (data) => api.post('/projects/', data),
    update: (id, data) => api.put(`/projects/${id}/`, data),
    delete: (id) => api.delete(`/projects/${id}/`),
};

export const memberService = {
    getAll: () => api.get('/members/'),
    getById: (id) => api.get(`/members/${id}/`),
    create: (data) => api.post('/members/', data),
    update: (id, data) => api.put(`/members/${id}/`, data),
    delete: (id) => api.delete(`/members/${id}/`),
};

export const taskService = {
    getAll: () => api.get('/tasks/'),
    getById: (id) => api.get(`/tasks/${id}/`),
    create: (data) => api.post('/tasks/', data),
    update: (id, data) => api.put(`/tasks/${id}/`, data),
    delete: (id) => api.delete(`/tasks/${id}/`),
};

export const dashboardService = {
    getStats: () => api.get('/dashboard/'),
};

export default api;
