import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url, response.data)
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.message)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  logout: () => api.post('/auth/logout'),
}

export const projectsAPI = {
  getAll: async () => {
    console.log('Fetching projects...')
    try {
      const response = await api.get('/projects')
      console.log('Projects response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error in projectsAPI.getAll:', error)
      throw error
    }
  },
  delete: (id) => api.delete(`/projects/${id}`),
}

export const resumeAPI = {
  getAll: async () => {
    console.log('Fetching resume...')
    try {
      const response = await api.get('/resume')
      console.log('Resume response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error in resumeAPI.getAll:', error)
      throw error
    }
  },
}

export const blogAPI = {
  getAll: async (params) => {
    console.log('Fetching blog posts...', params)
    try {
      const response = await api.get('/blog', { params })
      console.log('Blog response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error in blogAPI.getAll:', error)
      throw error
    }
  },
  getBySlug: async (slug) => {
    console.log('Fetching blog post by slug:', slug)
    try {
      const response = await api.get(`/blog/post/${slug}`)
      console.log('Blog post response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error in blogAPI.getBySlug:', error)
      throw error
    }
  },
}

export const contactAPI = {
  submit: (message) => api.post('/contact', message),
  getAll: async () => {
    const response = await api.get('/contact')
    return response.data
  },
}

export const adminAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data
  },
}

export default api 