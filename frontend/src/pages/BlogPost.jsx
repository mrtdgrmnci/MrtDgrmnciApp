import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Calendar, Clock, Tag, ArrowLeft, Share2, BookOpen, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { blogAPI } from '../services/api'

const BlogPost = () => {
  const { slug } = useParams()

  const { data: post, isLoading, error } = useQuery(
    ['blogPost', slug],
    () => blogAPI.getBySlug(slug),
    {
      enabled: !!slug
    }
  )

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

  if (error || !post) {
    return (
      <div className="section-padding pt-24">
        <div className="container mx-auto container-padding">
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-neon-red to-neon-orange rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-futuristic font-bold mb-4 text-neon-red">Post Not Found</h1>
            <p className="text-futuristic-300 mb-8 max-w-md mx-auto">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/blog" className="btn-futuristic">
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const shareUrl = window.location.href
  const shareText = `Check out this blog post: ${post.title}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: shareUrl
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        // You could add a toast notification here
      } catch (error) {
        console.log('Error copying to clipboard:', error)
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - MRT Portfolio</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        {post.featured_image && (
          <meta property="og:image" content={post.featured_image} />
        )}
      </Helmet>

      <article className="section-padding pt-24">
        <div className="container mx-auto container-padding max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 text-neon-blue hover:text-neon-cyan transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Blog</span>
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            {/* Featured Image */}
            {post.featured_image && (
              <div className="relative overflow-hidden rounded-2xl mb-8">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-futuristic-950/50 via-transparent to-transparent" />
              </div>
            )}

            {/* Article Meta */}
            <div className="flex items-center space-x-6 text-futuristic-400 text-sm mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{post.read_time || '5 min read'}</span>
              </div>
              {post.author && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
              )}
            </div>

            {/* Article Title */}
            <h1 className="text-responsive-2xl md:text-4xl lg:text-5xl font-futuristic font-bold text-futuristic-100 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Article Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-futuristic-300 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Article Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-futuristic-800/50 border border-futuristic-700/50 text-neon-cyan rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-futuristic-800/50 border border-futuristic-700/50 text-futuristic-300 hover:text-neon-blue hover:border-neon-blue/30 rounded-lg transition-all duration-300"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </motion.header>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-futuristic font-bold text-futuristic-100 mb-6 mt-12 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-futuristic font-bold text-futuristic-100 mb-4 mt-10">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-futuristic font-bold text-futuristic-100 mb-3 mt-8">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-lg font-futuristic font-bold text-futuristic-100 mb-2 mt-6">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-futuristic-300 mb-6 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-futuristic-300 mb-6 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-futuristic-300 mb-6 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-futuristic-300">
                    {children}
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-neon-blue bg-futuristic-800/50 pl-6 py-4 my-6 italic text-futuristic-200">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isInline = !className
                  return isInline ? (
                    <code className="bg-futuristic-800 text-neon-green px-2 py-1 rounded text-sm">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-futuristic-800 text-neon-green p-4 rounded-lg overflow-x-auto text-sm">
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="bg-futuristic-800 border border-futuristic-700 rounded-lg p-4 overflow-x-auto my-6">
                    {children}
                  </pre>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-neon-blue hover:text-neon-cyan underline transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => (
                  <strong className="font-futuristic font-bold text-futuristic-100">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-futuristic-200">
                    {children}
                  </em>
                ),
                hr: () => (
                  <hr className="border-futuristic-700 my-8" />
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="w-full border-collapse border border-futuristic-700">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-futuristic-700 px-4 py-2 text-left bg-futuristic-800 text-futuristic-100 font-futuristic font-bold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-futuristic-700 px-4 py-2 text-futuristic-300">
                    {children}
                  </td>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </motion.div>

          {/* Article Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 pt-8 border-t border-futuristic-700/50"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <p className="text-futuristic-400 text-sm">
                  Published on {formatDate(post.created_at)}
                </p>
                {post.updated_at && post.updated_at !== post.created_at && (
                  <p className="text-futuristic-400 text-sm">
                    Last updated on {formatDate(post.updated_at)}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-futuristic-800/50 border border-futuristic-700/50 text-futuristic-300 hover:text-neon-blue hover:border-neon-blue/30 rounded-lg transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Article</span>
                </button>
                
                <Link
                  to="/blog"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-cyan text-white rounded-lg hover:shadow-neon-blue transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Blog</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </article>
    </>
  )
}

export default BlogPost 