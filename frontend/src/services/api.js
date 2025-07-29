import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout'),
  changePassword: (passwords) => api.post('/auth/change-password', passwords),
}

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get('/projects')
    console.log('API Response:', response)
    console.log('API Response data:', response.data)
    return response.data
  },
  getFeatured: () => api.get('/projects/featured'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (project) => api.post('/projects', project),
  update: (id, project) => api.put(`/projects/${id}`, project),
  delete: (id) => api.delete(`/projects/${id}`),
  reorder: (projectOrders) => api.post('/projects/reorder', { projectOrders }),
}

// Resume API
export const resumeAPI = {
  getAll: () => api.get('/resume'),
  getSkills: () => api.get('/resume/skills'),
  getExperience: () => api.get('/resume/experience'),
  getEducation: () => api.get('/resume/education'),
  
  // Skills
  createSkill: (skill) => api.post('/resume/skills', skill),
  updateSkill: (id, skill) => api.put(`/resume/skills/${id}`, skill),
  deleteSkill: (id) => api.delete(`/resume/skills/${id}`),
  
  // Experience
  createExperience: (experience) => api.post('/resume/experience', experience),
  updateExperience: (id, experience) => api.put(`/resume/experience/${id}`, experience),
  deleteExperience: (id) => api.delete(`/resume/experience/${id}`),
  
  // Education
  createEducation: (education) => api.post('/resume/education', education),
  updateEducation: (id, education) => api.put(`/resume/education/${id}`, education),
  deleteEducation: (id) => api.delete(`/resume/education/${id}`),
}

// Blog API
export const blogAPI = {
  getAll: (params) => api.get('/blog', { params }),
  getAdmin: () => api.get('/blog/admin'),
  getBySlug: (slug) => api.get(`/blog/post/${slug}`),
  getById: (id) => api.get(`/blog/${id}`),
  getTags: () => api.get('/blog/tags/all'),
  create: (post) => api.post('/blog', post),
  update: (id, post) => api.put(`/blog/${id}`, post),
  delete: (id) => api.delete(`/blog/${id}`),
  getStats: () => api.get('/blog/stats/overview'),
}

// Contact API
export const contactAPI = {
  submit: (message) => api.post('/contact', message),
  getAll: () => api.get('/contact'),
  getUnread: () => api.get('/contact/unread'),
  getById: (id) => api.get(`/contact/${id}`),
  markAsRead: (id) => api.patch(`/contact/${id}/read`),
  markAsUnread: (id) => api.patch(`/contact/${id}/unread`),
  delete: (id) => api.delete(`/contact/${id}`),
  getStats: () => api.get('/contact/stats/overview'),
}

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getActivity: (params) => api.get('/admin/activity', { params }),
  getHealth: () => api.get('/admin/health'),
  getBackup: () => api.get('/admin/backup'),
  clearAll: (confirm) => api.delete(`/admin/clear-all?confirm=${confirm}`),
}

export default api 