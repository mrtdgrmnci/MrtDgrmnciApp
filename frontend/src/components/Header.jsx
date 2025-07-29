import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Resume', href: '/resume' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-futuristic-900/80 backdrop-blur-md border-b border-futuristic-700/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-lg flex items-center justify-center group-hover:shadow-neon-blue transition-all duration-300">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 w-8 h-8 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-futuristic font-bold text-neon-blue group-hover:text-neon-cyan transition-colors duration-300">
                MRT
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'text-neon-blue bg-futuristic-800/50 border border-neon-blue/30'
                        : 'text-futuristic-300 hover:text-neon-blue hover:bg-futuristic-800/30'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-cyan/10 rounded-lg border border-neon-blue/20"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-futuristic-300 hover:text-neon-blue hover:bg-futuristic-800/30 rounded-lg transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Geometric Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-futuristic-950/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-80 bg-futuristic-900/95 backdrop-blur-md border-l border-futuristic-700/50 z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-futuristic-700/30">
                  <h2 className="text-lg font-futuristic font-semibold text-neon-blue">Navigation</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-futuristic-300 hover:text-neon-blue hover:bg-futuristic-800/30 rounded-lg transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-6">
                  <ul className="space-y-2">
                    {navigation.map((item) => {
                      const isActive = location.pathname === item.href
                      return (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                              isActive
                                ? 'text-neon-blue bg-futuristic-800/50 border border-neon-blue/30'
                                : 'text-futuristic-300 hover:text-neon-blue hover:bg-futuristic-800/30'
                            }`}
                          >
                            {item.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-futuristic-700/30">
                  <div className="text-center text-futuristic-400 text-sm">
                    <p>Ready to explore?</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header 