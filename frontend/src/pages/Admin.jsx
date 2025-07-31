import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { contactAPI, adminAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  const [tab, setTab] = useState('dashboard')
  const [contactMessages, setContactMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    setIsAuthenticated(true)
  }, [navigate])

  // Fetch dashboard statistics
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: adminAPI.getDashboardStats,
    enabled: isAuthenticated && tab === 'dashboard',
    retry: false,
    onError: (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/admin/login')
      }
    }
  })

  useEffect(() => {
    if (tab === 'contact' && isAuthenticated) {
      fetchContactMessages()
    }
  }, [tab, isAuthenticated])

  const fetchContactMessages = async () => {
    setLoading(true)
    try {
      const data = await contactAPI.getAll()
      setContactMessages(data)
    } catch (error) {
      console.error('Error fetching contact messages:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/admin/login')
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }
  
  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setTab('dashboard')} 
          className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
            tab === 'dashboard' 
              ? 'bg-accent text-[#18191A]' 
              : 'bg-[#232427] text-accent border border-[#232427] hover:border-accent'
          }`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setTab('contact')} 
          className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
            tab === 'contact' 
              ? 'bg-accent text-[#18191A]' 
              : 'bg-[#232427] text-accent border border-[#232427] hover:border-accent'
          }`}
        >
          Contact Messages
        </button>
        <button 
          onClick={() => setTab('settings')} 
          className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
            tab === 'settings' 
              ? 'bg-accent text-[#18191A]' 
              : 'bg-[#232427] text-accent border border-[#232427] hover:border-accent'
          }`}
        >
          Settings
        </button>
      </div>
      
      <div className="bg-[#232427] rounded-xl p-7 border border-[#232427] shadow-sm min-h-[200px]">
        {tab === 'dashboard' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Dashboard Overview</h2>
            
            {statsLoading ? (
              <div className="text-[#b0b3b8] text-center py-8">Loading dashboard statistics...</div>
            ) : dashboardStats ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#18191A] rounded-lg p-4 border border-[#232427]">
                  <div className="text-2xl font-bold text-accent mb-1">{dashboardStats.projectsCount || 0}</div>
                  <div className="text-sm text-[#b0b3b8]">Total Projects</div>
                </div>
                <div className="bg-[#18191A] rounded-lg p-4 border border-[#232427]">
                  <div className="text-2xl font-bold text-accent mb-1">{dashboardStats.resumeCount || 0}</div>
                  <div className="text-sm text-[#b0b3b8]">Resume Items</div>
                </div>
                <div className="bg-[#18191A] rounded-lg p-4 border border-[#232427]">
                  <div className="text-2xl font-bold text-accent mb-1">{dashboardStats.blogCount || 0}</div>
                  <div className="text-sm text-[#b0b3b8]">Blog Posts</div>
                </div>
                <div className="bg-[#18191A] rounded-lg p-4 border border-[#232427]">
                  <div className="text-2xl font-bold text-accent mb-1">{dashboardStats.contactCount || 0}</div>
                  <div className="text-sm text-[#b0b3b8]">Contact Messages</div>
                </div>
              </div>
            ) : (
              <div className="text-red-500 text-center py-8">
                Error loading dashboard statistics. Please try again.
              </div>
            )}
            
            <div className="mt-8 p-4 bg-[#18191A] rounded-lg border border-[#232427]">
              <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setTab('contact')}
                  className="p-3 bg-accent text-[#18191A] rounded-lg text-sm font-medium hover:bg-[#FFD700]/90 transition"
                >
                  View Contact Messages
                </button>
                <button 
                  onClick={() => window.open('/projects', '_blank')}
                  className="p-3 bg-[#232427] text-accent border border-[#232427] rounded-lg text-sm font-medium hover:border-accent transition"
                >
                  View Projects
                </button>
                <button 
                  onClick={() => window.open('/blog', '_blank')}
                  className="p-3 bg-[#232427] text-accent border border-[#232427] rounded-lg text-sm font-medium hover:border-accent transition"
                >
                  View Blog
                </button>
              </div>
            </div>
          </div>
        )}
        
        {tab === 'contact' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Contact Messages</h2>
              <div className="flex gap-2">
                <span className="text-sm text-[#b0b3b8] px-3 py-1 bg-[#18191A] rounded">
                  {contactMessages.length} messages
                </span>
                <button 
                  onClick={fetchContactMessages}
                  className="px-3 py-1 bg-accent text-[#18191A] rounded text-xs font-medium hover:bg-[#FFD700]/90 transition"
                >
                  Refresh
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-[#b0b3b8] text-center py-8">Loading messages...</div>
            ) : contactMessages.length === 0 ? (
              <div className="text-[#b0b3b8] text-center py-8">No contact messages yet.</div>
            ) : (
              <div className="space-y-4">
                {contactMessages.map((message) => (
                  <div key={message.id} className="bg-[#18191A] rounded-lg p-4 border border-[#232427] hover:border-accent transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-white font-semibold">{message.name}</h3>
                        <p className="text-accent text-sm">{message.email}</p>
                      </div>
                      <span className="text-[#b0b3b8] text-xs">{formatDate(message.created_at)}</span>
                    </div>
                    {message.subject && (
                      <p className="text-[#b0b3b8] text-sm mb-2">
                        <strong>Subject:</strong> {message.subject}
                      </p>
                    )}
                    <p className="text-[#b0b3b8] text-sm whitespace-pre-wrap">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {tab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>
            <div className="space-y-6">
              <div className="bg-[#18191A] rounded-lg p-4 border border-[#232427]">
                <h3 className="text-lg font-semibold text-white mb-3">Profile Settings</h3>
                <p className="text-[#b0b3b8] text-sm mb-4">Manage your profile information and preferences.</p>
                <button className="px-4 py-2 bg-accent text-[#18191A] rounded text-sm font-medium hover:bg-[#FFD700]/90 transition">
                  Edit Profile
                </button>
              </div>
              
              <div className="bg-[#18191A] rounded-lg p-4 border border-[#232427]">
                <h3 className="text-lg font-semibold text-white mb-3">Security</h3>
                <p className="text-[#b0b3b8] text-sm mb-4">Update your password and security settings.</p>
                <button className="px-4 py-2 bg-accent text-[#18191A] rounded text-sm font-medium hover:bg-[#FFD700]/90 transition">
                  Change Password
                </button>
              </div>
              
              <div className="bg-[#18191A] rounded-lg p-4 border border-[#232427]">
                <h3 className="text-lg font-semibold text-white mb-3">Notifications</h3>
                <p className="text-[#b0b3b8] text-sm mb-4">Configure email notifications for new contact messages.</p>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="email-notifications" className="rounded" defaultChecked />
                  <label htmlFor="email-notifications" className="text-[#b0b3b8] text-sm">
                    Email notifications for new contact messages
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default Admin 