import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react'

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | MRT Portfolio</title>
        <meta name="description" content="Page not found" />
      </Helmet>

      <div className="section-padding pt-24">
        <div className="container mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            {/* 404 Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-neon-red to-neon-orange rounded-full flex items-center justify-center"
            >
              <AlertTriangle className="w-16 h-16 text-white" />
            </motion.div>

            {/* 404 Number */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-8xl md:text-9xl font-futuristic font-bold text-gradient-red mb-8"
            >
              404
            </motion.h1>

            {/* Error Message */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-3xl md:text-4xl font-futuristic font-bold text-futuristic-100 mb-4"
            >
              Page Not Found
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-lg text-futuristic-300 mb-8 max-w-md mx-auto"
            >
              The page you're looking for doesn't exist or has been moved to a different location.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/"
                className="btn-futuristic group"
              >
                <Home className="w-4 h-4 mr-2" />
                <span>Go Home</span>
              </Link>

              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-futuristic-800/50 backdrop-blur-sm border border-futuristic-700/50 text-futuristic-300 hover:text-neon-cyan hover:border-neon-cyan/30 rounded-lg transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                <span>Go Back</span>
              </button>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-16"
            >
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default NotFound 