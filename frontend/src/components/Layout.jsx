import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  const [isDark] = useState(true) // Always dark for futuristic theme

  return (
    <div className={`min-h-screen bg-futuristic-950 ${isDark ? 'dark' : ''}`}>
      {/* Geometric Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Triangles */}
        <div className="absolute top-20 left-10 w-16 h-16 triangle opacity-5 animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-12 h-12 triangle opacity-5 animate-float-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 triangle opacity-5 animate-float-slow" style={{ animationDelay: '4s' }}></div>
        
        {/* Floating Hexagons */}
        <div className="absolute top-60 left-1/4 w-8 h-8 hexagon opacity-5 animate-geometric-float"></div>
        <div className="absolute bottom-60 right-1/4 w-12 h-12 hexagon opacity-5 animate-geometric-float" style={{ animationDelay: '3s' }}></div>
        
        {/* Floating Diamonds */}
        <div className="absolute top-1/3 right-10 w-10 h-10 diamond opacity-5 animate-float-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-6 h-6 diamond opacity-5 animate-geometric-float" style={{ animationDelay: '5s' }}></div>
        
        {/* Floating Octagons */}
        <div className="absolute top-1/4 left-1/2 w-14 h-14 octagon opacity-5 animate-float-slow" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-8 h-8 octagon opacity-5 animate-geometric-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        
        <Footer />
      </div>

      {/* Subtle Grid Pattern */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>
    </div>
  )
}

export default Layout 