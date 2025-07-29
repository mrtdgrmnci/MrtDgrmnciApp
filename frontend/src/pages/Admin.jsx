import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  MessageSquare, 
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import { authAPI, projectsAPI, resumeAPI, blogAPI, contactAPI, adminAPI } from '../services/api'

// Admin Dashboard Component
const Dashboard = () => {
  const { data: stats, isLoading } = useQuery('adminStats', adminAPI.getDashboardStats)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner w-8 h-8"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-500 dark:text-dark-400">Total Projects</p>
              <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats?.projects || 0}</p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <FolderOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-500 dark:text-dark-400">Blog Posts</p>
              <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats?.blogPosts || 0}</p>
            </div>
            <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-500 dark:text-dark-400">Contact Messages</p>
              <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats?.contactMessages || 0}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-500 dark:text-dark-400">Unread Messages</p>
              <p className="text-2xl font-bold text-dark-900 dark:text-white">{stats?.unreadMessages || 0}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <EyeOff className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-sm text-dark-600 dark:text-dark-300">New project added: E-Commerce Platform</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
              <span className="text-sm text-dark-600 dark:text-dark-300">Blog post published: React Hooks Guide</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-dark-600 dark:text-dark-300">New contact message received</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/admin/projects"
              className="flex items-center space-x-2 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </Link>
            <Link
              to="/admin/blog"
              className="flex items-center space-x-2 p-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Blog Post</span>
            </Link>
            <Link
              to="/admin/contact"
              className="flex items-center space-x-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>View Messages</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Projects Management Component
const ProjectsManagement = () => {
  const queryClient = useQueryClient()
  const { data: projects, isLoading } = useQuery('projects', projectsAPI.getAll)
  
  const deleteMutation = useMutation(projectsAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects')
      toast.success('Project deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete project')
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner w-8 h-8"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden"
          >
            <div className="aspect-video bg-dark-100 dark:bg-dark-800 relative">
              <img
                src={project.image_url || 'https://via.placeholder.com/400x300'}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {project.featured && (
                <div className="absolute top-2 right-2 bg-secondary-500 text-white px-2 py-1 rounded text-xs">
                  Featured
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{project.title}</h3>
              <p className="text-sm text-dark-600 dark:text-dark-300 mb-3 line-clamp-2">
                {project.description}
              </p>
              <div className="flex space-x-2">
                <button className="p-2 text-primary-600 hover:bg-primary-50 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  onClick={() => deleteMutation.mutate(project.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Blog Management Component
const BlogManagement = () => {
  const { data: posts, isLoading } = useQuery('blogPosts', blogAPI.getAll)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner w-8 h-8"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Post</span>
        </button>
      </div>

      <div className="space-y-4">
        {posts?.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold mb-1">{post.title}</h3>
                <p className="text-sm text-dark-600 dark:text-dark-300 mb-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center space-x-4 text-xs text-dark-500">
                  <span>Status: {post.published ? 'Published' : 'Draft'}</span>
                  <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-primary-600 hover:bg-primary-50 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Contact Management Component
const ContactManagement = () => {
  const { data: messages, isLoading } = useQuery('contactMessages', contactAPI.getAll)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner w-8 h-8"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contact Messages</h2>

      <div className="space-y-4">
        {messages?.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card p-4 ${!message.read ? 'border-l-4 border-primary-500' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold mb-1">{message.name}</h3>
                <p className="text-sm text-primary-600 mb-2">{message.email}</p>
                {message.subject && (
                  <p className="text-sm font-medium mb-2">{message.subject}</p>
                )}
                <p className="text-dark-600 dark:text-dark-300 mb-2">
                  {message.message}
                </p>
                <div className="text-xs text-dark-500">
                  {new Date(message.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex space-x-2">
                {!message.read && (
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Settings Component
const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              defaultValue="admin"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              defaultValue="admin@example.com"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="input-field"
            />
          </div>
          <button className="btn-primary">Update Settings</button>
        </div>
      </div>
    </div>
  )
}

// Main Admin Component
const Admin = () => {
  const location = useLocation()
  const queryClient = useQueryClient()

  const logoutMutation = useMutation(authAPI.logout, {
    onSuccess: () => {
      queryClient.clear()
      // Redirect to login or home
    }
  })

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Contact', href: '/admin/contact', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - MRT Portfolio</title>
        <meta name="description" content="Admin dashboard for portfolio management" />
      </Helmet>

      <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-800 shadow-lg">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-dark-200 dark:border-dark-700">
              <h1 className="text-xl font-bold text-dark-900 dark:text-white">Admin Panel</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-dark-200 dark:border-dark-700">
              <button
                onClick={() => logoutMutation.mutate()}
                className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64">
          <div className="p-8">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectsManagement />} />
              <Route path="blog" element={<BlogManagement />} />
              <Route path="contact" element={<ContactManagement />} />
              <Route path="settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}

export default Admin 