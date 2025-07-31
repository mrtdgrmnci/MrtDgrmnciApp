import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Projects from '../pages/Projects'
import { projectsAPI } from '../services/api'

// Mock the API
vi.mock('../services/api', () => ({
  projectsAPI: {
    getAll: vi.fn()
  }
}))

const mockProjects = [
  {
    id: 1,
    title: 'AI-Powered Test Automation Framework',
    description: 'Advanced test automation framework integrating AI capabilities',
    technologies: JSON.stringify(['Selenium', 'Java', 'AI/ML', 'TestNG']),
    image_url: 'https://via.placeholder.com/600x400/2563eb/ffffff?text=AI+Testing+Framework',
    github_url: 'https://github.com/mrtdgrmnci/ai-testing-framework',
    live_url: null,
    featured: true,
    order_index: 1,
    created_at: '2025-07-29T21:00:00.000Z'
  },
  {
    id: 2,
    title: 'Playwright E2E Testing Suite',
    description: 'Modern end-to-end testing solution with Playwright',
    technologies: JSON.stringify(['Playwright', 'TypeScript', 'Jest']),
    image_url: 'https://via.placeholder.com/600x400/059669/ffffff?text=Playwright+Testing',
    github_url: 'https://github.com/mrtdgrmnci/playwright-suite',
    live_url: 'https://playwright-demo.example.com',
    featured: true,
    order_index: 2,
    created_at: '2025-07-28T21:00:00.000Z'
  },
  {
    id: 3,
    title: 'API Testing Framework',
    description: 'Comprehensive API testing with Rest Assured',
    technologies: JSON.stringify(['Rest Assured', 'Java', 'Maven']),
    image_url: 'https://via.placeholder.com/600x400/dc2626/ffffff?text=API+Testing',
    github_url: 'https://github.com/mrtdgrmnci/api-testing-framework',
    live_url: null,
    featured: false,
    order_index: 3,
    created_at: '2025-07-27T21:00:00.000Z'
  }
]

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const renderWithProviders = (component) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Projects Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the projects page title', () => {
    projectsAPI.getAll.mockResolvedValue(mockProjects)
    renderWithProviders(<Projects />)
    
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('renders search and filter controls', () => {
    projectsAPI.getAll.mockResolvedValue(mockProjects)
    renderWithProviders(<Projects />)
    
    expect(screen.getByLabelText('Search projects')).toBeInTheDocument()
    expect(screen.getByLabelText('Filter by technology')).toBeInTheDocument()
  })

  it('displays loading state', () => {
    projectsAPI.getAll.mockImplementation(() => new Promise(() => {})) // Never resolves
    renderWithProviders(<Projects />)
    
    expect(screen.getByText('Loading projects...')).toBeInTheDocument()
  })

  it('displays projects when data loads successfully', async () => {
    projectsAPI.getAll.mockResolvedValue(mockProjects)
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('AI-Powered Test Automation Framework')).toBeInTheDocument()
      expect(screen.getByText('Playwright E2E Testing Suite')).toBeInTheDocument()
      expect(screen.getByText('API Testing Framework')).toBeInTheDocument()
    })
  })

  it('displays project descriptions', async () => {
    projectsAPI.getAll.mockResolvedValue(mockProjects)
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('Advanced test automation framework integrating AI capabilities')).toBeInTheDocument()
      expect(screen.getByText('Modern end-to-end testing solution with Playwright')).toBeInTheDocument()
    })
  })

  it('displays technology tags', async () => {
    projectsAPI.getAll.mockResolvedValue(mockProjects)
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('Selenium')).toBeInTheDocument()
      expect(screen.getByText('Java')).toBeInTheDocument()
      expect(screen.getByText('AI/ML')).toBeInTheDocument()
      expect(screen.getByText('Playwright')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })
  })

  it('filters projects by search term', async () => {
    projectsAPI.getAll.mockResolvedValue(mockProjects)
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('AI-Powered Test Automation Framework')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByLabelText('Search projects')
    fireEvent.change(searchInput, { target: { value: 'AI' } })
    
    await waitFor(() => {
      expect(screen.getByText('AI-Powered Test Automation Framework')).toBeInTheDocument()
      expect(screen.queryByText('Playwright E2E Testing Suite')).not.toBeInTheDocument()
    })
  })

  it('filters projects by technology category', async () => {
    projectsAPI.getAll.mockResolvedValue(mockProjects)
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('AI-Powered Test Automation Framework')).toBeInTheDocument()
    })
    
    const categorySelect = screen.getByLabelText('Filter by technology')
    fireEvent.change(categorySelect, { target: { value: 'Playwright' } })
    
    await waitFor(() => {
      expect(screen.getByText('Playwright E2E Testing Suite')).toBeInTheDocument()
      expect(screen.queryByText('AI-Powered Test Automation Framework')).not.toBeInTheDocument()
    })
  })

  it('displays GitHub links when available', async () => {
    projectsAPI.getAll.mockResolvedValue(mockProjects)
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      const githubLinks = screen.getAllByText('GitHub')
      expect(githubLinks).toHaveLength(3)
      
      githubLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })
  })

  it('displays live links when available', async () => {
    projectsAPI.getAll.mockResolvedValue(mockProjects)
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      const liveLinks = screen.getAllByText('Live')
      expect(liveLinks).toHaveLength(1) // Only Playwright project has live URL
      
      liveLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })
  })

  it('displays error message when API fails', async () => {
    projectsAPI.getAll.mockRejectedValue(new Error('Failed to fetch projects'))
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('Error loading projects: Failed to fetch projects')).toBeInTheDocument()
    })
  })

  it('displays no projects message when filtered results are empty', async () => {
    projectsAPI.getAll.mockResolvedValue(mockProjects)
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('AI-Powered Test Automation Framework')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByLabelText('Search projects')
    fireEvent.change(searchInput, { target: { value: 'NonExistentProject' } })
    
    await waitFor(() => {
      expect(screen.getByText('No projects found.')).toBeInTheDocument()
    })
  })

  it('has correct CSS classes for project cards', async () => {
    projectsAPI.getAll.mockResolvedValue(mockProjects)
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      const projectCards = document.querySelectorAll('.bg-\\[\\#232427\\]')
      expect(projectCards.length).toBeGreaterThan(0)
      
      projectCards.forEach(card => {
        expect(card).toHaveClass('bg-[#232427]', 'rounded-xl', 'p-7', 'flex', 'flex-col', 'gap-4')
      })
    })
  })

  it('has correct CSS classes for search and filter controls', () => {
    projectsAPI.getAll.mockResolvedValue(mockProjects)
    renderWithProviders(<Projects />)
    
    const searchInput = screen.getByLabelText('Search projects')
    const categorySelect = screen.getByLabelText('Filter by technology')
    
    expect(searchInput).toHaveClass('bg-[#232427]', 'text-white', 'placeholder-[#b0b3b8]', 'px-5', 'py-3', 'rounded-lg')
    expect(categorySelect).toHaveClass('bg-[#232427]', 'text-white', 'px-5', 'py-3', 'rounded-lg')
  })

  it('handles projects with missing technologies gracefully', async () => {
    const projectsWithMissingTech = [
      {
        id: 1,
        title: 'Project without technologies',
        description: 'A project with no technology data',
        technologies: null,
        github_url: 'https://github.com/test/project',
        live_url: null
      }
    ]
    
    projectsAPI.getAll.mockResolvedValue(projectsWithMissingTech)
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('Project without technologies')).toBeInTheDocument()
    })
  })

  it('handles malformed technology JSON gracefully', async () => {
    const projectsWithMalformedTech = [
      {
        id: 1,
        title: 'Project with malformed tech',
        description: 'A project with invalid JSON in technologies',
        technologies: 'invalid json',
        github_url: 'https://github.com/test/project',
        live_url: null
      }
    ]
    
    projectsAPI.getAll.mockResolvedValue(projectsWithMalformedTech)
    renderWithProviders(<Projects />)
    
    await waitFor(() => {
      expect(screen.getByText('Project with malformed tech')).toBeInTheDocument()
    })
  })
}) 