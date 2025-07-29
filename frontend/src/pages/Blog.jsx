import { useState } from 'react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Calendar, Clock, Tag, ArrowRight, BookOpen, Search, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { blogAPI } from '../services/api'

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTag, setSelectedTag] = useState('')
  const postsPerPage = 6

  const { data: blogData, isLoading, error } = useQuery(
    ['blog', currentPage, selectedTag],
    () => blogAPI.getAll({ page: currentPage, limit: postsPerPage, tag: selectedTag })
  )

  const { data: tags } = useQuery('blogTags', blogAPI.getTags)

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

  const handleTagFilter = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-futuristic font-bold mb-4 text-neon-red">Error Loading Blog</h2>
            <p className="text-futuristic-300 mb-4 max-w-md mx-auto">
              Error loading blog posts. Please try again later.
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
        <title>Blog - MRT Portfolio</title>
        <meta name="description" content="Read my thoughts on web development, technology, and industry insights." />
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
              <BookOpen className="w-4 h-4" />
              <span>Latest Articles</span>
            </div>
            
            <h1 className="text-responsive-3xl font-futuristic font-bold mb-6 text-gradient-purple">
              Blog
            </h1>
            <p className="text-lg text-futuristic-300 max-w-3xl mx-auto">
              Thoughts, tutorials, and insights about web development, technology, and the industry.
            </p>
          </motion.div>

          {/* Tags Filter */}
          {tags && tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-12"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-4 h-4 text-futuristic-400" />
                <span className="text-futuristic-300 text-sm font-medium">Filter by tag:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTagFilter('')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedTag === ''
                      ? 'bg-neon-purple text-white shadow-neon-purple'
                      : 'bg-futuristic-800/50 border border-futuristic-700/50 text-futuristic-300 hover:text-neon-purple hover:border-neon-purple/30'
                  }`}
                >
                  All Posts
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedTag === tag
                        ? 'bg-neon-purple text-white shadow-neon-purple'
                        : 'bg-futuristic-800/50 border border-futuristic-700/50 text-futuristic-300 hover:text-neon-purple hover:border-neon-purple/30'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Blog Posts Grid */}
          {blogData?.posts && blogData.posts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {blogData.posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  variants={itemVariants}
                  className="card-futuristic group overflow-hidden"
                >
                  {/* Post Image */}
                  {post.featured_image && (
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-futuristic-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-6">
                    {/* Post Meta */}
                    <div className="flex items-center space-x-4 text-futuristic-400 text-sm mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.read_time || '5 min read'}</span>
                      </div>
                    </div>

                    {/* Post Title */}
                    <h2 className="text-xl font-futuristic font-bold text-futuristic-100 mb-3 group-hover:text-neon-purple transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Post Excerpt */}
                    <p className="text-futuristic-300 mb-4 line-clamp-3">
                      {post.excerpt || post.content?.substring(0, 150) + '...'}
                    </p>

                    {/* Post Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-futuristic-800/50 border border-futuristic-700/50 text-neon-cyan rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-futuristic-700/50 text-futuristic-400 rounded-full">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Read More Link */}
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center text-neon-purple hover:text-neon-pink transition-colors duration-300 font-medium group"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-futuristic-800/50 border border-futuristic-700/50 rounded-full flex items-center justify-center">
                <BookOpen className="text-futuristic-400" size={24} />
              </div>
              <h3 className="text-xl font-futuristic font-semibold mb-2 text-futuristic-200">No posts found</h3>
              <p className="text-futuristic-400">
                {selectedTag ? `No posts found for tag "${selectedTag}".` : 'No blog posts available yet.'}
              </p>
            </motion.div>
          )}

          {/* Pagination */}
          {blogData?.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center items-center space-x-2"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-futuristic-800/50 border border-futuristic-700/50 text-futuristic-300 hover:text-neon-blue hover:border-neon-blue/30 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: blogData.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-neon-blue text-white shadow-neon-blue'
                      : 'bg-futuristic-800/50 border border-futuristic-700/50 text-futuristic-300 hover:text-neon-blue hover:border-neon-blue/30'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === blogData.totalPages}
                className="px-4 py-2 bg-futuristic-800/50 border border-futuristic-700/50 text-futuristic-300 hover:text-neon-blue hover:border-neon-blue/30 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}

export default Blog 