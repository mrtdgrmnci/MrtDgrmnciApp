import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, Download, Mail, Github, Linkedin, Twitter, Zap, Code, Globe, Users, Award } from 'lucide-react'

const Home = () => {
  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: Github },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  ]

  const stats = [
    { label: 'Test Suites Built', value: '50+', icon: Code },
    { label: 'Years Experience', value: '5+', icon: Award },
    { label: 'Happy Clients', value: '30+', icon: Users },
    { label: 'Automation Tools', value: '15+', icon: Globe },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>MRT - Test Automation Advisor & Tech Enthusiast</title>
        <meta name="description" content="Test automation advisor passionate about creating innovative testing solutions and sharing knowledge through writing and open source contributions." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-futuristic-gradient"></div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 triangle opacity-5 animate-float-slow"></div>
          <div className="absolute top-40 right-20 w-24 h-24 hexagon opacity-5 animate-geometric-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 triangle opacity-5 animate-float-slow" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 diamond opacity-5 animate-geometric-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-futuristic-800/50 backdrop-blur-sm border border-neon-blue/30 rounded-full text-neon-blue text-sm font-medium mb-8 -ml-40 md:-ml-48 lg:-ml-56 mt-4"
            >
              <Zap className="w-4 h-4" />
              <span>Test Automation Advisor</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-responsive-3xl md:text-6xl lg:text-7xl font-futuristic font-bold mb-6"
            >
              <span className="text-gradient-blue">Automating</span>{' '}
              <span className="text-futuristic-100">Quality Assurance</span>{' '}
              <br />
              <span className="text-gradient-purple">One Test at a Time</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-futuristic-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            >
              Test automation advisor passionate about creating innovative testing solutions, 
              crafting robust automation frameworks, and pushing the boundaries of quality assurance.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/projects"
                className="btn-futuristic group"
              >
                <span>View My Projects</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/contact"
                className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-medium rounded-lg hover:shadow-neon-purple transition-all duration-300 hover:scale-105 group"
              >
                <Mail className="w-4 h-4 inline mr-2" />
                <span>Get In Touch</span>
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center space-x-4"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-futuristic-800/50 backdrop-blur-sm border border-futuristic-700/50 text-futuristic-300 hover:text-neon-blue hover:border-neon-blue/30 hover:bg-futuristic-800/70 rounded-lg transition-all duration-300"
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-futuristic-400 text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-futuristic-600 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-neon-blue rounded-full mt-2"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-futuristic-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-xl flex items-center justify-center group-hover:shadow-neon-blue transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-futuristic font-bold text-neon-blue mb-2">
                  {stat.value}
                </div>
                <div className="text-futuristic-300 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-futuristic-800/50 border border-neon-purple/30 rounded-full text-neon-purple text-sm font-medium mb-6">
                <Code className="w-4 h-4" />
                <span>About Me</span>
              </div>
              
              <h2 className="text-responsive-2xl font-futuristic font-bold mb-6 text-gradient-purple">
                Passionate Developer & Problem Solver
              </h2>
              
              <p className="text-futuristic-300 mb-6 leading-relaxed">
                I'm a full-stack developer with a passion for creating innovative web solutions 
                that make a difference. With expertise in modern technologies and a keen eye for 
                design, I build applications that are not only functional but also delightful to use.
              </p>
              
              <p className="text-futuristic-300 mb-8 leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to 
                open-source projects, or sharing knowledge through writing and mentoring.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/resume"
                  className="btn-futuristic group"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download Resume</span>
                </Link>
                
                <Link
                  to="/projects"
                  className="px-6 py-3 bg-futuristic-800/50 backdrop-blur-sm border border-futuristic-700/50 text-futuristic-300 hover:text-neon-cyan hover:border-neon-cyan/30 rounded-lg transition-all duration-300"
                >
                  View Projects
                </Link>
              </div>
            </motion.div>

            {/* Visual Element */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full h-96 bg-gradient-to-br from-futuristic-800 to-futuristic-700 rounded-2xl overflow-hidden">
                {/* Geometric Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-20 h-20 triangle bg-neon-blue"></div>
                  <div className="absolute top-20 right-20 w-16 h-16 hexagon bg-neon-cyan"></div>
                  <div className="absolute bottom-20 left-20 w-24 h-24 diamond bg-neon-purple"></div>
                  <div className="absolute bottom-10 right-10 w-12 h-12 octagon bg-neon-pink"></div>
                </div>
                
                {/* Code Lines */}
                <div className="absolute inset-0 p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-neon-red rounded-full"></div>
                      <div className="w-3 h-3 bg-neon-orange rounded-full"></div>
                      <div className="w-3 h-3 bg-neon-green rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-futuristic-700/50 rounded w-3/4"></div>
                      <div className="h-4 bg-futuristic-700/50 rounded w-1/2 ml-4"></div>
                      <div className="h-4 bg-futuristic-700/50 rounded w-2/3 ml-8"></div>
                      <div className="h-4 bg-futuristic-700/50 rounded w-1/3 ml-4"></div>
                      <div className="h-4 bg-futuristic-700/50 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home 