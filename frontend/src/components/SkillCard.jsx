import { motion } from 'framer-motion'
import { Code, Database, Globe, Zap } from 'lucide-react'

const SkillCard = ({ skill }) => {
  // Map skill categories to icons
  const getIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'frontend':
        return <Globe className="w-6 h-6" />
      case 'backend':
        return <Database className="w-6 h-6" />
      case 'database':
        return <Database className="w-6 h-6" />
      case 'devops':
        return <Zap className="w-6 h-6" />
      default:
        return <Code className="w-6 h-6" />
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="card-futuristic p-6 text-center group"
    >
      {/* Skill Icon */}
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-xl flex items-center justify-center text-white group-hover:shadow-neon-blue transition-all duration-300">
        {getIcon(skill.category)}
      </div>

      {/* Skill Name */}
      <h3 className="font-futuristic font-semibold text-futuristic-100 mb-3 group-hover:text-neon-blue transition-colors duration-300">
        {skill.name}
      </h3>

      {/* Proficiency Bar */}
      <div className="w-full bg-futuristic-700/50 rounded-full h-3 mb-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency || 0}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-3 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full"
        />
      </div>

      {/* Proficiency Percentage */}
      <p className="text-sm text-futuristic-400 mb-4">
        {skill.proficiency || 0}% Proficiency
      </p>

      {/* Category Badge */}
      <div className="mt-auto">
        <span className="inline-block px-3 py-1 text-xs bg-futuristic-800/50 border border-futuristic-700/50 text-neon-cyan rounded-full font-medium">
          {skill.category || 'General'}
        </span>
      </div>
    </motion.div>
  )
}

export default SkillCard 