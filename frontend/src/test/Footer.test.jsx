import { render, screen } from '@testing-library/react'
import Footer from '../components/Footer'

describe('Footer Component', () => {
  it('renders the footer with correct structure', () => {
    render(<Footer />)
    
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveClass('w-full', 'text-center', 'py-6', 'text-xs', 'text-[#b0b3b8]', 'border-t', 'border-[#232427]', 'mt-16')
  })

  it('renders social links', () => {
    render(<Footer />)
    
    // Check GitHub link
    const githubLink = screen.getByText('GitHub')
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href', 'https://github.com/')
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(githubLink).toHaveClass('hover:text-accent', 'transition')
    
    // Check LinkedIn link
    const linkedinLink = screen.getByText('LinkedIn')
    expect(linkedinLink).toBeInTheDocument()
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/')
    expect(linkedinLink).toHaveAttribute('target', '_blank')
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(linkedinLink).toHaveClass('hover:text-accent', 'transition')
    
    // Check Email link
    const emailLink = screen.getByText('Email')
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', 'mailto:mrtdgrmnci@gmail.com')
    expect(emailLink).toHaveClass('hover:text-accent', 'transition')
  })

  it('displays copyright text with current year', () => {
    render(<Footer />)
    
    const currentYear = new Date().getFullYear()
    const copyrightText = screen.getByText(`© ${currentYear} Test Automation Advisor. All rights reserved.`)
    expect(copyrightText).toBeInTheDocument()
  })

  it('has correct link container styling', () => {
    render(<Footer />)
    
    const linkContainer = screen.getByText('GitHub').closest('div')
    expect(linkContainer).toHaveClass('flex', 'justify-center', 'gap-4', 'mb-2')
  })

  it('renders all expected links', () => {
    render(<Footer />)
    
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3) // GitHub, LinkedIn, Email
    
    const linkTexts = links.map(link => link.textContent)
    expect(linkTexts).toContain('GitHub')
    expect(linkTexts).toContain('LinkedIn')
    expect(linkTexts).toContain('Email')
  })

  it('has proper link attributes for external links', () => {
    render(<Footer />)
    
    const externalLinks = ['GitHub', 'LinkedIn']
    externalLinks.forEach(linkText => {
      const link = screen.getByText(linkText)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
    
    // Email link should not have target="_blank"
    const emailLink = screen.getByText('Email')
    expect(emailLink).not.toHaveAttribute('target')
    expect(emailLink).not.toHaveAttribute('rel')
  })

  it('maintains proper footer hierarchy', () => {
    render(<Footer />)
    
    const footer = screen.getByRole('contentinfo')
    const linkContainer = footer.querySelector('div')
    const copyrightDiv = screen.getByText(/© \d{4} Test Automation Advisor/)
    
    expect(footer).toContainElement(linkContainer)
    expect(footer).toContainElement(copyrightDiv)
  })

  it('has consistent styling across all links', () => {
    render(<Footer />)
    
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveClass('hover:text-accent', 'transition')
    })
  })

  it('displays correct copyright text format', () => {
    render(<Footer />)
    
    const copyrightText = screen.getByText(/© \d{4} Test Automation Advisor\. All rights reserved\./)
    expect(copyrightText).toBeInTheDocument()
    
    // Verify the year is current
    const currentYear = new Date().getFullYear()
    expect(copyrightText.textContent).toContain(currentYear.toString())
  })
}) 