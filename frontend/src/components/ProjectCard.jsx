import { motion } from 'framer-motion'
import { ExternalLink, Github, Star, Calendar, Code } from 'lucide-react'

const ProjectCard = ({ project }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="card-futuristic group h-full"
    >
      {/* Project Image */}
      <div className="relative overflow-hidden rounded-t-xl">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-futuristic-800 to-futuristic-700 flex items-center justify-center">
            <Code className="w-12 h-12 text-futuristic-400" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-futuristic-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 left-4">
            <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-neon-orange to-neon-red text-white text-xs font-medium rounded-full">
              <Star className="w-3 h-3" />
              <span>Featured</span>
            </div>
          </div>
        )}
        
        {/* Date Badge */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 px-3 py-1 bg-futuristic-800/80 backdrop-blur-sm text-futuristic-300 text-xs font-medium rounded-full border border-futuristic-700/50">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(project.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col h-full">
        {/* Title */}
        <h3 className="text-xl font-futuristic font-bold mb-3 text-futuristic-100 group-hover:text-neon-blue transition-colors duration-300">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-futuristic-300 mb-4 line-clamp-3 flex-grow">
          {project.description}
        </p>

        {/* Technologies */}
        {(() => {
          const technologies = typeof project.technologies === 'string' 
            ? JSON.parse(project.technologies || '[]') 
            : project.technologies || []
          
          return technologies.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {technologies.slice(0, 4).map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs bg-futuristic-800/50 border border-futuristic-700/50 text-neon-cyan rounded-full font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {technologies.length > 4 && (
                  <span className="px-3 py-1 text-xs bg-futuristic-700/50 text-futuristic-400 rounded-full">
                    +{technologies.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )
        })()}

        {/* Links */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-futuristic-700/30">
          <div className="flex space-x-3">
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-futuristic-800/50 border border-futuristic-700/50 text-futuristic-300 hover:text-neon-blue hover:border-neon-blue/30 hover:bg-futuristic-800/70 rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-4 h-4" />
              </motion.a>
            )}
            
            {project.live_url && (
              <motion.a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-futuristic-800/50 border border-futuristic-700/50 text-futuristic-300 hover:text-neon-green hover:border-neon-green/30 hover:bg-futuristic-800/70 rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            )}
          </div>

          {/* View Details Button */}
          <motion.button
            className="px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-cyan text-white text-sm font-medium rounded-lg hover:shadow-neon-blue transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.button>
        </div>
      </div>

      {/* Geometric Accent */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-neon-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}

export default ProjectCard 