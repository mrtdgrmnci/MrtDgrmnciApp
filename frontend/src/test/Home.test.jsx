import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Home from '../pages/Home'

const renderWithProviders = (component) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </HelmetProvider>
  )
}

describe('Home Page', () => {
  it('renders the hero section with correct content', () => {
    renderWithProviders(<Home />)
    
    // Check title and subtitle
    expect(screen.getByText('QA Automation Advisor')).toBeInTheDocument()
    expect(screen.getByText('Murat Degirmenci')).toBeInTheDocument()
    expect(screen.getByText('10+ Years Experience')).toBeInTheDocument()
    
    // Check description
    expect(screen.getByText(/QA Advisor at General Dynamics/)).toBeInTheDocument()
  })

  it('renders navigation buttons', () => {
    renderWithProviders(<Home />)
    
    const viewProjectsButton = screen.getByText('View Projects')
    const contactButton = screen.getByText('Contact')
    
    expect(viewProjectsButton).toBeInTheDocument()
    expect(contactButton).toBeInTheDocument()
    
    expect(viewProjectsButton).toHaveAttribute('href', '/projects')
    expect(contactButton).toHaveAttribute('href', '/contact')
  })

  it('renders skills and expertise sections', () => {
    renderWithProviders(<Home />)
    
    // Check section headings
    expect(screen.getByText('Core Technologies')).toBeInTheDocument()
    expect(screen.getByText('Security & Management')).toBeInTheDocument()
    
    // Check technology items
    expect(screen.getByText('AI Testing')).toBeInTheDocument()
    expect(screen.getByText('Selenium WebDriver')).toBeInTheDocument()
    expect(screen.getByText('Playwright')).toBeInTheDocument()
  })

  it('displays technology descriptions', () => {
    renderWithProviders(<Home />)
    
    expect(screen.getByText('Intelligent Test Automation')).toBeInTheDocument()
    expect(screen.getByText('UI Automation Framework')).toBeInTheDocument()
    expect(screen.getByText('Modern E2E Testing')).toBeInTheDocument()
  })

  it('renders security and management content', () => {
    renderWithProviders(<Home />)
    
    expect(screen.getByText(/Cybersecurity testing, test management/)).toBeInTheDocument()
    expect(screen.getByText(/government clearance compliance/)).toBeInTheDocument()
  })

  it('has correct CSS classes for hero section', () => {
    renderWithProviders(<Home />)
    
    const heroSection = screen.getByText('QA Automation Advisor').closest('section')
    expect(heroSection).toHaveClass('min-h-[60vh]', 'flex', 'flex-col', 'justify-center', 'items-start', 'max-w-3xl', 'mx-auto', 'py-24')
  })

  it('has correct CSS classes for skills section', () => {
    renderWithProviders(<Home />)
    
    const skillsSection = screen.getByText('Core Technologies').closest('section')
    expect(skillsSection).toHaveClass('max-w-4xl', 'mx-auto', 'py-12', 'grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-8')
  })

  it('renders skill cards with correct styling', () => {
    renderWithProviders(<Home />)
    
    const skillCards = document.querySelectorAll('.bg-\\[\\#232427\\]')
    expect(skillCards).toHaveLength(2)
    
    skillCards.forEach(card => {
      expect(card).toHaveClass('bg-[#232427]', 'rounded', 'p-6')
    })
  })

  it('has proper button styling', () => {
    renderWithProviders(<Home />)
    
    const viewProjectsButton = screen.getByText('View Projects')
    const contactButton = screen.getByText('Contact')
    
    expect(viewProjectsButton).toHaveClass('px-6', 'py-3', 'bg-accent', 'text-[#18191A]', 'font-semibold', 'rounded', 'hover:opacity-90', 'transition')
    expect(contactButton).toHaveClass('px-6', 'py-3', 'border', 'border-accent', 'text-accent', 'font-semibold', 'rounded', 'hover:bg-accent', 'hover:text-[#18191A]', 'transition')
  })

  it('renders section headings with correct styling', () => {
    renderWithProviders(<Home />)
    
    const headings = screen.getAllByText(/Core Technologies|Security & Management/)
    headings.forEach(heading => {
      expect(heading).toHaveClass('text-sm', 'font-semibold', 'text-accent', 'mb-2', 'tracking-widest', 'uppercase')
    })
  })

  it('displays technology items with proper hierarchy', () => {
    renderWithProviders(<Home />)
    
    const aiTesting = screen.getByText('AI Testing')
    const aiDescription = screen.getByText('Intelligent Test Automation')
    
    expect(aiTesting).toHaveClass('text-sm', 'text-[#b0b3b8]', 'mb-1')
    expect(aiDescription).toHaveClass('text-xs', 'text-[#b0b3b8]')
  })

  it('has proper link structure in skills section', () => {
    renderWithProviders(<Home />)
    
    const projectLink = screen.getAllByText('View Projects')[1] // Second "View Projects" link in skills section
    expect(projectLink).toHaveAttribute('href', '/projects')
    expect(projectLink).toHaveClass('text-accent', 'text-xs', 'font-semibold', 'mt-4', 'hover:underline')
  })

  it('maintains responsive design classes', () => {
    renderWithProviders(<Home />)
    
    const mainHeading = screen.getByText('Murat Degirmenci')
    expect(mainHeading).toHaveClass('text-4xl', 'md:text-6xl')
    
    const skillsSection = screen.getByText('Core Technologies').closest('section')
    expect(skillsSection).toHaveClass('grid-cols-1', 'md:grid-cols-2')
  })

  it('renders all expected content sections', () => {
    renderWithProviders(<Home />)
    
    // Hero section content
    expect(screen.getByText('QA Automation Advisor')).toBeInTheDocument()
    expect(screen.getByText('Murat Degirmenci')).toBeInTheDocument()
    expect(screen.getByText('10+ Years Experience')).toBeInTheDocument()
    
    // Skills section content
    expect(screen.getByText('Core Technologies')).toBeInTheDocument()
    expect(screen.getByText('Security & Management')).toBeInTheDocument()
    
    // Navigation
    expect(screen.getAllByText('View Projects')).toHaveLength(2)
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })
}) 