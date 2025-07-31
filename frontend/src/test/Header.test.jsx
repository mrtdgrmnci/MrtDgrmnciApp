import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import Header from '../components/Header'

const renderWithRouter = (component, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {component}
    </MemoryRouter>
  )
}

describe('Header Component', () => {
  it('renders the header with logo', () => {
    renderWithRouter(<Header />)
    
    const logo = screen.getByText('MRT')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('href', '/')
    expect(logo).toHaveClass('text-xl', 'font-bold', 'tracking-tight', 'text-accent')
  })

  it('renders all navigation links', () => {
    renderWithRouter(<Header />)
    
    const navigationItems = ['Home', 'Projects', 'Resume', 'Blog', 'Contact']
    
    navigationItems.forEach(item => {
      const link = screen.getByText(item)
      expect(link).toBeInTheDocument()
      expect(link.tagName).toBe('A')
    })
  })

  it('has correct navigation structure', () => {
    renderWithRouter(<Header />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveClass('flex', 'items-center', 'gap-2')
    
    const links = nav.querySelectorAll('a')
    expect(links).toHaveLength(5) // Home, Projects, Resume, Blog, Contact
  })

  it('highlights active navigation item', () => {
    renderWithRouter(<Header />, { route: '/projects' })
    
    const projectsLink = screen.getByText('Projects')
    expect(projectsLink).toHaveClass('text-accent')
    
    // Other links should not be highlighted
    const homeLink = screen.getByText('Home')
    expect(homeLink).toHaveClass('text-[#b0b3b8]', 'hover:text-accent')
  })

  it('highlights home link when on home page', () => {
    renderWithRouter(<Header />, { route: '/' })
    
    const homeLink = screen.getByText('Home')
    expect(homeLink).toHaveClass('text-accent')
  })

  it('highlights contact link when on contact page', () => {
    renderWithRouter(<Header />, { route: '/contact' })
    
    const contactLink = screen.getByText('Contact')
    expect(contactLink).toHaveClass('text-accent')
  })

  it('has correct navigation links with proper hrefs', () => {
    renderWithRouter(<Header />)
    
    const expectedLinks = [
      { name: 'Home', href: '/' },
      { name: 'Projects', href: '/projects' },
      { name: 'Resume', href: '/resume' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' }
    ]
    
    expectedLinks.forEach(({ name, href }) => {
      const link = screen.getByText(name)
      expect(link).toHaveAttribute('href', href)
    })
  })

  it('has correct CSS classes for header structure', () => {
    renderWithRouter(<Header />)
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('w-full', 'border-b', 'border-[#232427]', 'bg-[#18191A]')
    
    const container = header.querySelector('div')
    expect(container).toHaveClass('flex', 'items-center', 'justify-between', 'h-16', 'px-6')
  })

  it('navigation links have correct styling classes', () => {
    renderWithRouter(<Header />)
    
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      if (link.textContent !== 'MRT') { // Skip logo
        expect(link).toHaveClass('px-3', 'py-2', 'rounded', 'text-sm', 'font-medium', 'transition-colors', 'duration-200')
      }
    })
  })

  it('handles different routes correctly', () => {
    const routes = ['/', '/projects', '/resume', '/blog', '/contact']
    
    routes.forEach(route => {
      const { unmount } = renderWithRouter(<Header />, { route })
      
      const expectedActiveLink = route === '/' ? 'Home' : route.slice(1).charAt(0).toUpperCase() + route.slice(2)
      const activeLink = screen.getByText(expectedActiveLink)
      expect(activeLink).toHaveClass('text-accent')
      
      unmount()
    })
  })

  it('maintains proper header layout', () => {
    renderWithRouter(<Header />)
    
    const header = screen.getByRole('banner')
    const container = header.querySelector('div')
    const logo = screen.getByText('MRT')
    const nav = screen.getByRole('navigation')
    
    expect(container).toContainElement(logo)
    expect(container).toContainElement(nav)
  })
}) 