import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter, Mail, Zap } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: Github },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'Email', href: 'mailto:contact@example.com', icon: Mail },
  ]

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Resume', href: '/resume' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="relative bg-futuristic-900/50 backdrop-blur-sm border-t border-futuristic-700/30">
      {/* Geometric Accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-lg flex items-center justify-center group-hover:shadow-neon-blue transition-all duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-futuristic font-bold text-neon-blue group-hover:text-neon-cyan transition-colors duration-300">
                MRT
              </span>
            </Link>
            <p className="text-futuristic-300 mb-6 max-w-md">
              Crafting digital experiences with cutting-edge technology and innovative design. 
              Building the future, one project at a time.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-futuristic-800/50 border border-futuristic-700/50 text-futuristic-300 hover:text-neon-blue hover:border-neon-blue/30 hover:bg-futuristic-800/70 rounded-lg transition-all duration-300 hover:scale-110"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-futuristic font-semibold text-neon-blue mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-futuristic-300 hover:text-neon-blue transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-futuristic font-semibold text-neon-blue mb-4">Get In Touch</h3>
            <div className="space-y-3">
              <p className="text-futuristic-300">
                Ready to start your next project?
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-medium rounded-lg hover:shadow-neon-blue transition-all duration-300 hover:scale-105"
              >
                Let's Connect
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-futuristic-700/30">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-futuristic-400 text-sm">
              © {currentYear} MRT. All rights reserved. Built with cutting-edge technology.
            </p>
            <div className="flex items-center space-x-4 text-sm text-futuristic-400">
              <span>Powered by</span>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-neon-blue rounded-full animate-pulse"></div>
                <span className="text-neon-blue font-futuristic">React</span>
              </div>
              <span>&</span>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-neon-cyan font-futuristic">Node.js</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute bottom-4 left-4 w-8 h-8 triangle opacity-10 animate-float-slow"></div>
      <div className="absolute bottom-8 right-8 w-6 h-6 hexagon opacity-10 animate-geometric-float" style={{ animationDelay: '2s' }}></div>
    </footer>
  )
}

export default Footer 