import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { projectsAPI } from '../services/api'

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  console.log('Projects component rendering...')
  
  const { data: projects = [], isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.getAll,
    onSuccess: (data) => {
      console.log('Projects loaded successfully:', data)
    },
    onError: (error) => {
      console.error('Error loading projects:', error)
    }
  })

  console.log('Projects component render:', { projects, isLoading, isError, error })

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(projects.flatMap(p => {
    try {
      return typeof p.technologies === 'string' ? JSON.parse(p.technologies) : p.technologies || []
    } catch {
      return []
    }
  })))]

  // Filtered projects
  const filtered = projects.filter(project => {
    const techs = typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies || []
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || techs.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  console.log('Filtered projects:', filtered)

  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-10 text-white tracking-tight">Projects</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-[#232427] text-white placeholder-[#b0b3b8] px-5 py-3 rounded-lg outline-none focus:ring-2 focus:ring-accent w-full md:w-2/3 transition border border-[#232427] focus:border-accent text-base"
          aria-label="Search projects"
        />
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="bg-[#232427] text-white px-5 py-3 rounded-lg outline-none focus:ring-2 focus:ring-accent border border-[#232427] focus:border-accent w-full md:w-1/3 text-base cursor-pointer transition"
          aria-label="Filter by technology"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <div className="text-[#b0b3b8] text-center py-12">Loading projects...</div>
      ) : isError ? (
        <div className="text-red-500 text-center py-12">
          Error loading projects: {error?.message || 'Unknown error'}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-[#b0b3b8] text-center py-12">No projects found.</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {filtered.map(project => {
            const techs = typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies || []
            return (
              <div key={project.id} className="bg-[#232427] rounded-xl p-7 flex flex-col gap-4 border border-[#232427] hover:border-accent transition group shadow-sm">
                <h2 className="text-xl font-semibold text-white mb-1 tracking-tight group-hover:text-accent transition">{project.title}</h2>
                <p className="text-[#b0b3b8] text-sm mb-1 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 text-xs mt-2">
                  {techs.map(tech => (
                    <span key={tech} className="px-2 py-1 bg-[#18191A] text-accent rounded font-medium tracking-wide border border-[#232427]">{tech}</span>
                  ))}
                </div>
                <div className="flex gap-4 mt-2">
                  {project.github_url && <a href={project.github_url} className="text-accent hover:underline text-xs font-semibold" target="_blank" rel="noopener noreferrer">GitHub</a>}
                  {project.live_url && <a href={project.live_url} className="text-accent hover:underline text-xs font-semibold" target="_blank" rel="noopener noreferrer">Live</a>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default Projects 