import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'

// Mock the child components
vi.mock('../components/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header Component</div>
  }
})

vi.mock('../components/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer Component</div>
  }
})

// Mock react-router-dom Outlet
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Page Content</div>
  }
})

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Layout Component', () => {
  it('renders the layout structure correctly', () => {
    renderWithRouter(<Layout />)
    
    // Check main layout structure
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })

  it('renders the sidebar with logo', () => {
    renderWithRouter(<Layout />)
    
    // Check logo
    const logo = screen.getByText('MD')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('href', '/')
    expect(logo).toHaveClass('text-2xl', 'font-bold', 'tracking-tight', 'text-accent')
  })

  it('renders social navigation links', () => {
    renderWithRouter(<Layout />)
    
    // Check GitHub link
    const githubLink = screen.getByLabelText('GitHub')
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href', 'https://github.com/mrtdgrmnci')
    expect(githubLink).toHaveClass('text-[#b0b3b8]', 'hover:text-accent')
    
    // Check Email link
    const emailLink = screen.getByLabelText('Email')
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', 'mailto:mrtdgrmnci@gmail.com')
    expect(emailLink).toHaveClass('text-[#b0b3b8]', 'hover:text-accent')
    
    // Check Phone link
    const phoneLink = screen.getByLabelText('Phone')
    expect(phoneLink).toBeInTheDocument()
    expect(phoneLink).toHaveAttribute('href', 'tel:+12025679551')
    expect(phoneLink).toHaveClass('text-[#b0b3b8]', 'hover:text-accent')
  })

  it('has correct CSS classes for responsive design', () => {
    renderWithRouter(<Layout />)
    
    // Check main container classes
    const mainContainer = screen.getByTestId('header').closest('.min-h-screen')
    expect(mainContainer).toHaveClass('min-h-screen', 'flex', 'bg-[#18191A]', 'text-white', 'font-sans')
    
    // Check sidebar classes
    const sidebar = mainContainer.querySelector('aside')
    expect(sidebar).toHaveClass('hidden', 'md:flex', 'flex-col', 'items-center', 'w-20', 'py-8', 'border-r', 'border-[#232427]', 'bg-[#18191A]')
    
    // Check main content area classes
    const mainContent = mainContainer.querySelector('.flex-1')
    expect(mainContent).toHaveClass('flex-1', 'flex', 'flex-col', 'min-h-screen')
  })

  it('renders SVG icons in social links', () => {
    renderWithRouter(<Layout />)
    
    // Check that SVG elements are present
    const svgElements = document.querySelectorAll('svg')
    expect(svgElements).toHaveLength(3) // GitHub, Email, Phone icons
    
    // Check that each social link contains an SVG
    const githubLink = screen.getByLabelText('GitHub')
    const emailLink = screen.getByLabelText('Email')
    const phoneLink = screen.getByLabelText('Phone')
    
    expect(githubLink.querySelector('svg')).toBeInTheDocument()
    expect(emailLink.querySelector('svg')).toBeInTheDocument()
    expect(phoneLink.querySelector('svg')).toBeInTheDocument()
  })

  it('has proper navigation structure', () => {
    renderWithRouter(<Layout />)
    
    // Check that social navigation is properly structured
    const nav = document.querySelector('nav')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveClass('flex', 'flex-col', 'gap-6', 'mt-auto', 'mb-8')
    
    // Check that all social links are within the nav
    const socialLinks = nav.querySelectorAll('a')
    expect(socialLinks).toHaveLength(3)
  })

  it('maintains proper layout hierarchy', () => {
    renderWithRouter(<Layout />)
    
    // Check that the layout follows the expected DOM structure
    const mainContainer = screen.getByTestId('header').closest('.min-h-screen')
    const sidebar = mainContainer.querySelector('aside')
    const mainContent = mainContainer.querySelector('.flex-1')
    
    expect(mainContainer).toContainElement(sidebar)
    expect(mainContainer).toContainElement(mainContent)
    expect(mainContent).toContainElement(screen.getByTestId('header'))
    expect(mainContent).toContainElement(screen.getByTestId('footer'))
  })
}) 