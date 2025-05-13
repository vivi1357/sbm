import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Employee endpoints
export const employeeApi = {
  getAll: () => api.get('/employees'),
  getBench: () => api.get('/employees/bench'),
  getById: (id: string) => api.get(`/employees/${id}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: string, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

// Project endpoints
export const projectApi = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Training endpoints
export const trainingApi = {
  getAll: () => api.get('/trainings'),
  getById: (id: string) => api.get(`/trainings/${id}`),
  create: (data: any) => api.post('/trainings', data),
  update: (id: string, data: any) => api.put(`/trainings/${id}`, data),
  delete: (id: string) => api.delete(`/trainings/${id}`),
};

// Matching service endpoints
export const matchingApi = {
  getProjectMatches: (projectId: string) => api.get(`/matching/project/${projectId}`),
  getEmployeeMatches: (employeeId: string) => api.get(`/matching/employee/${employeeId}`),
};

export default api; 