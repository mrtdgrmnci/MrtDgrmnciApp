import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { blogAPI } from '../services/api'
import { Link } from 'react-router-dom'

const Blog = () => {
  const [selectedTag, setSelectedTag] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage] = useState(5)
  
  console.log('Blog component rendering...')
  
  const { data: posts = [], isLoading, isError, error } = useQuery({
    queryKey: ['blog', selectedTag],
    queryFn: () => blogAPI.getAll({ tag: selectedTag === 'All' ? '' : selectedTag }),
    onSuccess: (data) => {
      console.log('Blog posts loaded successfully:', data)
      setCurrentPage(1) // Reset to first page when tag changes
    },
    onError: (error) => {
      console.error('Error loading blog posts:', error)
    }
  })

  console.log('Blog component render:', { posts, isLoading, isError, error })

  // Compute unique tags from posts
  const tags = Array.from(new Set(posts.flatMap(post => {
    try {
      return Array.isArray(post.tags)
        ? post.tags
        : typeof post.tags === 'string'
        ? JSON.parse(post.tags || '[]')
        : []
    } catch {
      return []
    }
  }))).filter(Boolean)

  console.log('Blog tags computed:', tags)

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(posts.length / postsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTagChange = (tag) => {
    setSelectedTag(tag)
    setCurrentPage(1)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString.slice(0, 10)
    }
  }

  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-10 text-white tracking-tight">Blog</h1>
      
      {/* Tag Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
            selectedTag === 'All' 
              ? 'bg-accent text-[#18191A]' 
              : 'bg-[#232427] text-accent border border-[#232427] hover:border-accent'
          }`}
          onClick={() => handleTagChange('All')}
        >
          All ({posts.length})
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
              selectedTag === tag 
                ? 'bg-accent text-[#18191A]' 
                : 'bg-[#232427] text-accent border border-[#232427] hover:border-accent'
            }`}
            onClick={() => handleTagChange(tag)}
          >
            {tag} ({posts.filter(post => {
              try {
                const postTags = Array.isArray(post.tags) 
                  ? post.tags 
                  : typeof post.tags === 'string' 
                  ? JSON.parse(post.tags || '[]') 
                  : []
                return postTags.includes(tag)
              } catch {
                return false
              }
            }).length})
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-[#b0b3b8] text-center py-12">
          <div className="animate-pulse">
            <div className="h-4 bg-[#232427] rounded mb-4"></div>
            <div className="h-4 bg-[#232427] rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-[#232427] rounded w-1/2"></div>
          </div>
        </div>
      ) : isError ? (
        <div className="text-red-500 text-center py-12">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Error loading blog posts</h3>
            <p className="text-sm">{error?.message || 'Unknown error occurred'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-[#b0b3b8] text-center py-12">
          <div className="bg-[#232427] rounded-lg p-8 border border-[#232427]">
            <h3 className="text-lg font-semibold text-white mb-2">No blog posts found</h3>
            <p className="text-sm">
              {selectedTag === 'All' 
                ? 'No blog posts are available at the moment.' 
                : `No blog posts found for the "${selectedTag}" tag.`
              }
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Blog Posts */}
          <div className="space-y-8">
            {currentPosts.map(post => (
              <div key={post.id} className="bg-[#232427] rounded-xl p-7 border border-[#232427] hover:border-accent transition shadow-sm">
                <Link to={`/blog/${post.slug || post.id}`} className="text-xl font-semibold text-white hover:text-accent hover:underline mb-2 block transition tracking-tight">
                  {post.title}
                </Link>
                <div className="text-xs text-[#b0b3b8] mb-3">{formatDate(post.created_at)}</div>
                <div className="text-sm text-[#b0b3b8] mb-4 leading-relaxed">{post.summary}</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {(Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? JSON.parse(post.tags || '[]') : [])).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-[#18191A] text-accent rounded font-medium tracking-wide border border-[#232427]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-[#232427] text-accent border border-[#232427] rounded-lg text-sm font-medium hover:border-accent transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? 'bg-accent text-[#18191A]'
                      : 'bg-[#232427] text-accent border border-[#232427] hover:border-accent'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-[#232427] text-accent border border-[#232427] rounded-lg text-sm font-medium hover:border-accent transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          {/* Posts count */}
          <div className="text-center mt-8 text-sm text-[#b0b3b8]">
            Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, posts.length)} of {posts.length} posts
          </div>
        </>
      )}
    </main>
  )
}

export default Blog 