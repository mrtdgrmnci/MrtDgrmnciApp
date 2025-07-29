import { useState } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Search, Filter, Zap, Code, Globe, Star } from 'lucide-react'
import { projectsAPI } from '../services/api'
import ProjectCard from '../components/ProjectCard'

const Projects = () => {
  console.log('Projects component rendering')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const { data: projects, isLoading, error } = useQuery('projects', projectsAPI.getAll, {
    onSuccess: (data) => {
      console.log('Projects loaded:', data)
      console.log('Projects type:', typeof data)
      console.log('Projects length:', data?.length)
      if (data && data.length > 0) {
        console.log('First project:', data[0])
        console.log('First project technologies:', data[0].technologies)
        console.log('First project technologies type:', typeof data[0].technologies)
      }
    },
    onError: (err) => {
      console.error('Error loading projects:', err)
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Filter and sort projects
  const filteredProjects = projects?.filter(project => {
    console.log('Filtering project:', project.title)
    // Parse technologies from JSON string if needed
    const technologies = typeof project.technologies === 'string' 
      ? JSON.parse(project.technologies || '[]') 
      : project.technologies || []
    
    console.log('Project technologies:', technologies)
    
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'featured' && project.featured) ||
                           technologies.includes(selectedCategory)
    
    console.log('Matches search:', matchesSearch, 'Matches category:', matchesCategory)
    
    return matchesSearch && matchesCategory
  }) || []

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'name':
        return a.title.localeCompare(b.title)
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      default:
        return 0
    }
  })

  // Get unique categories from technologies
  const categories = ['all', 'featured']
  if (projects) {
    projects.forEach(project => {
      const technologies = typeof project.technologies === 'string' 
        ? JSON.parse(project.technologies || '[]') 
        : project.technologies || []
      
      technologies.forEach(tech => {
        if (!categories.includes(tech)) {
          categories.push(tech)
        }
      })
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  if (isLoading) {
    console.log('Projects loading...')
    return (
      <div className="section-padding pt-24">
        <div className="container mx-auto container-padding">
          <div className="flex justify-center items-center py-20">
            <div className="spinner-futuristic"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    console.error('Projects error:', error)
    return (
      <div className="section-padding pt-24">
        <div className="container mx-auto container-padding">
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-neon-red to-neon-orange rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-futuristic font-bold mb-4 text-neon-red">Error Loading Projects</h2>
            <p className="text-futuristic-300 mb-4 max-w-md mx-auto">
              {error.message || 'Error loading projects. Please try again later.'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-futuristic"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  console.log('Projects rendering main content, projects:', projects)
  console.log('Filtered projects:', filteredProjects)
  console.log('Sorted projects:', sortedProjects)
  return (
    <>
      <Helmet>
        <title>Projects - MRT Portfolio</title>
        <meta name="description" content="Explore my portfolio of web development projects, showcasing various technologies and solutions." />
      </Helmet>

      <section className="section-padding pt-24">
        <div className="container mx-auto container-padding">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-futuristic-800/50 border border-neon-blue/30 rounded-full text-neon-blue text-sm font-medium mb-6">
              <Code className="w-4 h-4" />
              <span>Portfolio Showcase</span>
            </div>
            
            <h1 className="text-responsive-3xl font-futuristic font-bold mb-6 text-gradient-blue">
              My Projects
            </h1>
            <p className="text-lg text-futuristic-300 max-w-3xl mx-auto">
              Here's a collection of projects I've worked on, showcasing my skills in web development, 
              problem-solving, and creating user-friendly applications.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-futuristic-400" size={20} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-futuristic pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-4 w-full lg:w-auto">
                {/* Category Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-futuristic-400" size={16} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-futuristic pl-10 pr-8 appearance-none cursor-pointer"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : 
                         category === 'featured' ? 'Featured' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-futuristic cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="featured">Featured First</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <p className="text-futuristic-400">
                Showing <span className="text-neon-blue font-semibold">{sortedProjects.length}</span> of{' '}
                <span className="text-neon-cyan font-semibold">{projects?.length || 0}</span> projects
              </p>
              
              {selectedCategory === 'featured' && (
                <div className="flex items-center space-x-2 text-neon-orange">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Featured Projects</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Projects Grid */}
          {sortedProjects.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {sortedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  custom={index}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-futuristic-800/50 border border-futuristic-700/50 rounded-full flex items-center justify-center">
                  <Search className="text-futuristic-400" size={24} />
                </div>
                <h3 className="text-xl font-futuristic font-semibold mb-2 text-futuristic-200">No projects found</h3>
                <p className="text-futuristic-400">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}

export default Projects 