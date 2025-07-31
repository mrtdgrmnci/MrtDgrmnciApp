import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { blogAPI } from '../services/api'
import { Link } from 'react-router-dom'

const Blog = () => {
  const [selectedTag, setSelectedTag] = useState('All')
  
  console.log('Blog component rendering...')
  
  const { data: posts = [], isLoading, isError, error } = useQuery({
    queryKey: ['blog', selectedTag],
    queryFn: () => blogAPI.getAll({ tag: selectedTag === 'All' ? '' : selectedTag }),
    onSuccess: (data) => {
      console.log('Blog posts loaded successfully:', data)
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

  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-10 text-white tracking-tight">Blog</h1>
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          className={`px-4 py-2 rounded-lg text-xs font-medium transition ${selectedTag === 'All' ? 'bg-accent text-[#18191A]' : 'bg-[#232427] text-accent border border-[#232427] hover:border-accent'}`}
          onClick={() => setSelectedTag('All')}
        >
          All
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition ${selectedTag === tag ? 'bg-accent text-[#18191A]' : 'bg-[#232427] text-accent border border-[#232427] hover:border-accent'}`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="text-[#b0b3b8] text-center py-12">Loading blog posts...</div>
      ) : isError ? (
        <div className="text-red-500 text-center py-12">
          Error loading blog posts: {error?.message || 'Unknown error'}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-[#b0b3b8] text-center py-12">No blog posts found.</div>
      ) : (
        <div className="space-y-8">
          {posts.map(post => (
            <div key={post.id} className="bg-[#232427] rounded-xl p-7 border border-[#232427] hover:border-accent transition shadow-sm">
              <Link to={`/blog/${post.id}`} className="text-xl font-semibold text-white hover:text-accent hover:underline mb-2 block transition tracking-tight">{post.title}</Link>
              <div className="text-xs text-[#b0b3b8] mb-1">{post.created_at?.slice(0, 10)}</div>
              <div className="text-sm text-[#b0b3b8] mb-2 leading-relaxed">{post.summary}</div>
              <div className="flex flex-wrap gap-2 text-xs mt-2">
                {(Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? JSON.parse(post.tags || '[]') : [])).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-[#18191A] text-accent rounded font-medium tracking-wide border border-[#232427]">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Blog 