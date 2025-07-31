import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Contact from '../pages/Contact'
import { contactAPI } from '../services/api'

// Mock the API
vi.mock('../services/api', () => ({
  contactAPI: {
    submit: vi.fn()
  }
}))

describe('Contact Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders contact form', () => {
    render(<Contact />)
    
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Your Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Subject')).toBeInTheDocument()
    expect(screen.getByLabelText('Your Message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    contactAPI.submit.mockResolvedValue({ data: { message: 'Success' } })
    
    render(<Contact />)
    
    await user.type(screen.getByLabelText('Your Name'), 'John Doe')
    await user.type(screen.getByLabelText('Your Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Subject'), 'Test Subject')
    await user.type(screen.getByLabelText('Your Message'), 'This is a test message.')
    
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    
    await waitFor(() => {
      expect(contactAPI.submit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message.'
      })
    })
    
    await waitFor(() => {
      expect(screen.getByText('✅ Message sent successfully! I\'ll get back to you soon.')).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    contactAPI.submit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<Contact />)
    
    await user.type(screen.getByLabelText('Your Name'), 'John Doe')
    await user.type(screen.getByLabelText('Your Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Your Message'), 'This is a test message.')
    
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    
    expect(screen.getByRole('button', { name: 'Sending...' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sending...' })).toBeDisabled()
  })

  it('shows error message on submission failure', async () => {
    const user = userEvent.setup()
    contactAPI.submit.mockRejectedValue(new Error('Network error'))
    
    render(<Contact />)
    
    await user.type(screen.getByLabelText('Your Name'), 'John Doe')
    await user.type(screen.getByLabelText('Your Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Your Message'), 'This is a test message.')
    
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    
    await waitFor(() => {
      expect(screen.getByText('❌ Error sending message. Please try again or contact me directly.')).toBeInTheDocument()
    })
  })

  it('clears form after successful submission', async () => {
    const user = userEvent.setup()
    contactAPI.submit.mockResolvedValue({ data: { message: 'Success' } })
    
    render(<Contact />)
    
    const nameInput = screen.getByLabelText('Your Name')
    const emailInput = screen.getByLabelText('Your Email')
    const messageInput = screen.getByLabelText('Your Message')
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(messageInput, 'This is a test message.')
    
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    
    await waitFor(() => {
      expect(nameInput.value).toBe('')
      expect(emailInput.value).toBe('')
      expect(messageInput.value).toBe('')
    })
  })

  it('requires name field', async () => {
    const user = userEvent.setup()
    
    render(<Contact />)
    
    await user.type(screen.getByLabelText('Your Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Your Message'), 'This is a test message.')
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' })
    expect(submitButton).toBeDisabled()
  })

  it('requires email field', async () => {
    const user = userEvent.setup()
    
    render(<Contact />)
    
    await user.type(screen.getByLabelText('Your Name'), 'John Doe')
    await user.type(screen.getByLabelText('Your Message'), 'This is a test message.')
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' })
    expect(submitButton).toBeDisabled()
  })

  it('requires message field', async () => {
    const user = userEvent.setup()
    
    render(<Contact />)
    
    await user.type(screen.getByLabelText('Your Name'), 'John Doe')
    await user.type(screen.getByLabelText('Your Email'), 'john@example.com')
    
    const submitButton = screen.getByRole('button', { name: 'Send Message' })
    expect(submitButton).toBeDisabled()
  })

  it('displays contact information', () => {
    render(<Contact />)
    
    expect(screen.getByText('Or contact me directly:')).toBeInTheDocument()
    expect(screen.getByText('mrtdgrmnci@gmail.com')).toBeInTheDocument()
    expect(screen.getByText('+1 (202) 567-9551')).toBeInTheDocument()
  })
}) 