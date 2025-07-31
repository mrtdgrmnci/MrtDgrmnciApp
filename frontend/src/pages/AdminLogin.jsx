import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/admin')
    }
  }, [navigate])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('') // Clear error when user types
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const response = await authAPI.login(form)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setStatus('success')
      navigate('/admin')
    } catch (err) {
      setStatus('error')
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    }
  }

  // Check if required fields are filled
  const isFormValid = form.email.trim() && form.password.trim()

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#18191A] px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Admin Login</h1>
          <p className="text-[#b0b3b8]">Access your portfolio dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-[#232427] rounded-xl p-8 flex flex-col gap-5 border border-[#232427] focus-within:border-accent transition shadow-sm">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-[#18191A] text-white placeholder-[#b0b3b8] px-5 py-3 rounded-lg outline-none focus:ring-2 focus:ring-accent border border-[#232427] focus:border-accent text-base transition"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-[#18191A] text-white placeholder-[#b0b3b8] px-5 py-3 rounded-lg outline-none focus:ring-2 focus:ring-accent border border-[#232427] focus:border-accent text-base transition"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-accent text-[#18191A] px-5 py-3 rounded-lg font-semibold hover:bg-[#FFD700]/90 transition text-base focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={status === 'loading' || !isFormValid}
          >
            {status === 'loading' ? 'Signing In...' : 'Sign In'}
          </button>
          
          {status === 'error' && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              ❌ {error}
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-green-500 text-sm text-center bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              ✅ Login successful! Redirecting...
            </div>
          )}
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-accent hover:underline text-sm">
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </main>
  )
}

export default AdminLogin 