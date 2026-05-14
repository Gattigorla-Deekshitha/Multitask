import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to handle token expiration/invalid tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login'; // Force redirect to login page
        }
        return Promise.reject(error);
    }
);

export const projectService = {
    getAll: (memberId) => api.get(memberId ? `projects/?member_id=${memberId}` : 'projects/'),
    getOne: (id) => api.get(`projects/${id}/`),
    create: (data) => api.post('projects/', data),
    update: (id, data) => api.put(`projects/${id}/`, data),
    delete: (id) => api.delete(`projects/${id}/`),
};

export const memberService = {
    getAll: () => api.get('members/'),
    getOne: (id) => api.get(`members/${id}/`),
    create: (data) => api.post('members/', data),
    update: (id, data) => api.put(`members/${id}/`, data),
    delete: (id) => api.delete(`members/${id}/`),
};

export const taskService = {
    getAll: (memberId) => api.get(memberId ? `tasks/?member_id=${memberId}` : 'tasks/'),
    getOne: (id) => api.get(`tasks/${id}/`),
    create: (data) => api.post('tasks/', data),
    update: (id, data) => api.put(`tasks/${id}/`, data),
    delete: (id) => api.delete(`tasks/${id}/`),
};

export const dashboardService = {
    getStats: (memberId) => api.get(memberId ? `dashboard/?member_id=${memberId}` : 'dashboard/'),
};

export default api;
