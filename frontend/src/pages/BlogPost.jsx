import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { blogAPI } from '../services/api'

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => blogAPI.getBySlug(slug),
    retry: 1,
    onError: (error) => {
      console.error('Error loading blog post:', error)
    }
  })

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

  const handleBackToBlog = () => {
    navigate('/blog')
  }

  if (isLoading) {
    return (
      <main className="max-w-2xl mx-auto py-16 px-4">
        <div className="text-[#b0b3b8] text-center py-12">
          <div className="animate-pulse">
            <div className="h-4 bg-[#232427] rounded mb-4 w-1/4"></div>
            <div className="h-8 bg-[#232427] rounded mb-4"></div>
            <div className="h-4 bg-[#232427] rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-[#232427] rounded mb-4"></div>
            <div className="h-4 bg-[#232427] rounded mb-4 w-2/3"></div>
            <div className="h-4 bg-[#232427] rounded mb-4 w-1/2"></div>
          </div>
        </div>
      </main>
    )
  }

  if (isError || !post) {
    return (
      <main className="max-w-2xl mx-auto py-16 px-4">
        <div className="text-red-500 text-center py-12">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Error loading blog post</h3>
            <p className="text-sm mb-4">
              {error?.response?.status === 404 
                ? 'Blog post not found.' 
                : error?.message || 'Unknown error occurred'
              }
            </p>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={handleBackToBlog}
                className="px-4 py-2 bg-accent text-[#18191A] rounded-lg text-sm font-medium hover:bg-[#FFD700]/90 transition"
              >
                Back to Blog
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <Link 
        to="/blog" 
        className="text-accent text-xs font-semibold hover:underline mb-6 inline-block transition"
      >
        ← Back to Blog
      </Link>
      
      <article className="bg-[#232427] rounded-xl p-7 border border-[#232427] shadow-sm">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-white tracking-tight">{post.title}</h1>
          <div className="text-xs text-[#b0b3b8] mb-4">{formatDate(post.created_at)}</div>
          {post.summary && (
            <div className="text-sm text-[#b0b3b8] mb-6 leading-relaxed bg-[#18191A] p-4 rounded-lg border border-[#232427]">
              {post.summary}
            </div>
          )}
        </header>
        
        <div className="prose prose-invert max-w-none text-[#b0b3b8] leading-relaxed" style={{whiteSpace: 'pre-line'}}>
          {post.content}
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-8 pt-6 border-t border-[#232427]">
            <div className="flex flex-wrap gap-2 text-xs">
              {(Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? JSON.parse(post.tags || '[]') : [])).map(tag => (
                <span key={tag} className="px-2 py-1 bg-[#18191A] text-accent rounded font-medium tracking-wide border border-[#232427]">
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        )}
      </article>
      
      <div className="mt-8 text-center">
        <Link 
          to="/blog" 
          className="text-accent hover:underline text-sm transition"
        >
          ← Back to Blog
        </Link>
      </div>
    </main>
  )
}

export default BlogPost 