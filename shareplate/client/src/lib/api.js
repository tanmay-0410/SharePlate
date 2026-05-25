import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    toast.error(msg);
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  firebaseAuth: (data) => api.post('/auth/firebase', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const userAPI = {
  uploadCertificate: (data) => api.post('/users/certificate/upload', data),
};

export const donationAPI = {
  create: (data) => api.post('/donations', data),
  getAll: (params) => api.get('/donations', { params }),
  getMine: () => api.get('/donations/mine'),
  getById: (id) => api.get(`/donations/${id}`),
  claim: (id) => api.post(`/donations/${id}/claim`),
  updateStatus: (id, status) => api.put(`/donations/${id}/status`, { status }),
  delete: (id) => api.delete(`/donations/${id}`),
  analyze: (image) => api.post('/donations/analyze', { image }),
};

export const ngoAPI = {
  register: (data) => api.post('/ngos', data),
  getAll: (params) => api.get('/ngos', { params }),
  getById: (id) => api.get(`/ngos/${id}`),
  update: (data) => api.put('/ngos', data),
  verify: (id) => api.put(`/ngos/${id}/verify`),
};

export const deliveryAPI = {
  create: (data) => api.post('/deliveries', data),
  getAll: () => api.get('/deliveries'),
  assign: (id) => api.put(`/deliveries/${id}/assign`),
  updateStatus: (id, data) => api.put(`/deliveries/${id}/status`, data),
};

export const analyticsAPI = {
  getStats: () => api.get('/analytics/stats'),
  getChart: () => api.get('/analytics/chart'),
  getTopDonors: () => api.get('/analytics/top-donors'),
};

export const rewardAPI = {
  getMyRewards: () => api.get('/rewards/me'),
  getLeaderboard: () => api.get('/rewards/leaderboard'),
  getBadges: () => api.get('/rewards/badges'),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (ids) => api.put('/notifications/read', { ids }),
};

export const chatAPI = {
  send: (message, context) => api.post('/chat/message', { message, context }),
};

export const uploadAPI = {
  image: (formData) => api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  base64: (image) => api.post('/upload/base64', { image }),
  certificate: (formData) => api.post('/upload/certificate', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
