import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Download, Calendar, MapPin, Building, GraduationCap, Award, Code, Briefcase, BookOpen } from 'lucide-react'
import { resumeAPI } from '../services/api'
import SkillCard from '../components/SkillCard'

const Resume = () => {
  const { data: resumeData, isLoading, error } = useQuery('resumeData', resumeAPI.getAll)

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
    return (
      <div className="section-padding pt-24">
        <div className="container mx-auto container-padding">
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-neon-red to-neon-orange rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-futuristic font-bold mb-4 text-neon-red">Error Loading Resume</h2>
            <p className="text-futuristic-300 mb-4 max-w-md mx-auto">
              Error loading resume data. Please try again later.
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

  return (
    <>
      <Helmet>
        <title>Resume - MRT Portfolio</title>
        <meta name="description" content="View my professional experience, skills, and education background." />
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
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-futuristic-800/50 border border-neon-purple/30 rounded-full text-neon-purple text-sm font-medium mb-6">
              <Briefcase className="w-4 h-4" />
              <span>Professional Experience</span>
            </div>
            
            <h1 className="text-responsive-3xl font-futuristic font-bold mb-6 text-gradient-purple">
              Resume
            </h1>
            <p className="text-lg text-futuristic-300 max-w-3xl mx-auto mb-8">
              Here's an overview of my professional journey, skills, and educational background.
            </p>
            <button className="btn-futuristic group">
              <Download className="w-4 h-4 mr-2" />
              <span>Download PDF</span>
            </button>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {/* Skills Section */}
            <motion.section variants={itemVariants}>
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-futuristic-800/50 border border-neon-blue/30 rounded-full text-neon-blue text-sm font-medium mb-4">
                  <Code className="w-4 h-4" />
                  <span>Technical Skills</span>
                </div>
                <h2 className="text-responsive-2xl font-futuristic font-bold mb-4 text-gradient-blue">
                  Skills & Technologies
                </h2>
                <p className="text-futuristic-300">
                  A comprehensive list of technologies and tools I work with.
                </p>
              </div>

              {resumeData?.skills && resumeData.skills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {resumeData.skills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <SkillCard skill={skill} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-futuristic-800/50 border border-futuristic-700/50 rounded-full flex items-center justify-center">
                    <Code className="text-futuristic-400" size={24} />
                  </div>
                  <h3 className="text-xl font-futuristic font-semibold mb-2 text-futuristic-200">No skills available</h3>
                  <p className="text-futuristic-400">
                    Skills information is not currently available.
                  </p>
                </div>
              )}
            </motion.section>

            {/* Experience Section */}
            <motion.section variants={itemVariants}>
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-futuristic-800/50 border border-neon-green/30 rounded-full text-neon-green text-sm font-medium mb-4">
                  <Briefcase className="w-4 h-4" />
                  <span>Work History</span>
                </div>
                <h2 className="text-responsive-2xl font-futuristic font-bold mb-4 text-gradient-green">
                  Professional Experience
                </h2>
                <p className="text-futuristic-300">
                  My journey through various roles and companies.
                </p>
              </div>

              {resumeData?.experience && resumeData.experience.length > 0 ? (
                <div className="space-y-8">
                  {resumeData.experience.map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card-futuristic p-6"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-futuristic font-bold text-futuristic-100 mb-2">
                            {exp.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-futuristic-300 mb-2">
                            <div className="flex items-center space-x-1">
                              <Building className="w-4 h-4" />
                              <span>{exp.company}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{exp.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-futuristic-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.start_date} - {exp.end_date || 'Present'}</span>
                        </div>
                      </div>
                      <p className="text-futuristic-300 leading-relaxed">
                        {exp.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-futuristic-800/50 border border-futuristic-700/50 rounded-full flex items-center justify-center">
                    <Briefcase className="text-futuristic-400" size={24} />
                  </div>
                  <h3 className="text-xl font-futuristic font-semibold mb-2 text-futuristic-200">No experience available</h3>
                  <p className="text-futuristic-400">
                    Experience information is not currently available.
                  </p>
                </div>
              )}
            </motion.section>

            {/* Education Section */}
            <motion.section variants={itemVariants}>
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-futuristic-800/50 border border-neon-cyan/30 rounded-full text-neon-cyan text-sm font-medium mb-4">
                  <BookOpen className="w-4 h-4" />
                  <span>Academic Background</span>
                </div>
                <h2 className="text-responsive-2xl font-futuristic font-bold mb-4 text-gradient-blue">
                  Education
                </h2>
                <p className="text-futuristic-300">
                  My academic achievements and educational background.
                </p>
              </div>

              {resumeData?.education && resumeData.education.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resumeData.education.map((edu, index) => (
                    <motion.div
                      key={edu.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card-futuristic p-6"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-blue rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-futuristic font-bold text-futuristic-100 mb-2">
                            {edu.degree}
                          </h3>
                          <p className="text-futuristic-300 mb-2">{edu.institution}</p>
                          <div className="flex items-center space-x-4 text-futuristic-400 text-sm">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{edu.start_date} - {edu.end_date || 'Present'}</span>
                            </div>
                            {edu.gpa && (
                              <div className="flex items-center space-x-1">
                                <Award className="w-4 h-4" />
                                <span>GPA: {edu.gpa}</span>
                              </div>
                            )}
                          </div>
                          {edu.description && (
                            <p className="text-futuristic-300 mt-3 text-sm">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-futuristic-800/50 border border-futuristic-700/50 rounded-full flex items-center justify-center">
                    <BookOpen className="text-futuristic-400" size={24} />
                  </div>
                  <h3 className="text-xl font-futuristic font-semibold mb-2 text-futuristic-200">No education available</h3>
                  <p className="text-futuristic-400">
                    Education information is not currently available.
                  </p>
                </div>
              )}
            </motion.section>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Resume 