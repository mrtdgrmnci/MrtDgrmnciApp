import { useState } from 'react'
import { contactAPI } from '../services/api'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      await contactAPI.submit(form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  // Check if required fields are filled
  const isFormValid = form.name.trim() && form.email.trim() && form.message.trim()

  return (
    <main className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-10 text-white tracking-tight">Contact</h1>
      <form onSubmit={handleSubmit} className="bg-[#232427] rounded-xl p-8 flex flex-col gap-5 border border-[#232427] focus-within:border-accent transition shadow-sm">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="bg-[#18191A] text-white placeholder-[#b0b3b8] px-5 py-3 rounded-lg outline-none focus:ring-2 focus:ring-accent border border-[#232427] focus:border-accent text-base transition"
          aria-label="Your Name"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="bg-[#18191A] text-white placeholder-[#b0b3b8] px-5 py-3 rounded-lg outline-none focus:ring-2 focus:ring-accent border border-[#232427] focus:border-accent text-base transition"
          aria-label="Your Email"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject (Optional)"
          value={form.subject}
          onChange={handleChange}
          className="bg-[#18191A] text-white placeholder-[#b0b3b8] px-5 py-3 rounded-lg outline-none focus:ring-2 focus:ring-accent border border-[#232427] focus:border-accent text-base transition"
          aria-label="Subject"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          rows={6}
          className="bg-[#18191A] text-white placeholder-[#b0b3b8] px-5 py-3 rounded-lg outline-none focus:ring-2 focus:ring-accent border border-[#232427] focus:border-accent text-base transition resize-none"
          aria-label="Your Message"
        />
        <button
          type="submit"
          className="bg-accent text-[#18191A] px-5 py-3 rounded-lg font-semibold hover:bg-[#FFD700]/90 transition text-base focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={status === 'loading' || !isFormValid}
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'success' && (
          <div className="text-green-500 text-sm text-center bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            ✅ Message sent successfully! I'll get back to you soon.
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-500 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            ❌ Error sending message. Please try again or contact me directly.
          </div>
        )}
      </form>
      <div className="mt-8 text-xs text-[#b0b3b8] text-center">
        <p>Or contact me directly:</p>
        <p><a href="mailto:mrtdgrmnci@gmail.com" className="text-accent hover:underline">mrtdgrmnci@gmail.com</a></p>
        <p><a href="tel:+12025679551" className="text-accent hover:underline">+1 (202) 567-9551</a></p>
      </div>
    </main>
  )
}

export default Contact 