import { useState, useEffect } from 'react'
import { contactAPI } from '../services/api'

const Admin = () => {
  const [tab, setTab] = useState('dashboard')
  const [contactMessages, setContactMessages] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (tab === 'contact') {
      fetchContactMessages()
    }
  }, [tab])

  const fetchContactMessages = async () => {
    setLoading(true)
    try {
      const data = await contactAPI.getAll()
      setContactMessages(data)
    } catch (error) {
      console.error('Error fetching contact messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }
  
  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-10 text-white tracking-tight">Admin Dashboard</h1>
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
          <div className="text-[#b0b3b8]">
            <h2 className="text-xl font-semibold text-white mb-4">Dashboard Overview</h2>
            <p>Welcome to the admin dashboard. Use the tabs above to manage your portfolio.</p>
          </div>
        )}
        
        {tab === 'contact' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Contact Messages</h2>
              <button 
                onClick={fetchContactMessages}
                className="px-3 py-1 bg-accent text-[#18191A] rounded text-xs font-medium hover:bg-[#FFD700]/90 transition"
              >
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="text-[#b0b3b8] text-center py-8">Loading messages...</div>
            ) : contactMessages.length === 0 ? (
              <div className="text-[#b0b3b8] text-center py-8">No contact messages yet.</div>
            ) : (
              <div className="space-y-4">
                {contactMessages.map((message) => (
                  <div key={message.id} className="bg-[#18191A] rounded-lg p-4 border border-[#232427]">
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
          <div className="text-[#b0b3b8]">
            <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
            <p>Settings configuration will be available here.</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default Admin 