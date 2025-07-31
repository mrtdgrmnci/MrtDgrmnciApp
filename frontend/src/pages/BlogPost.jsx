import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { blogAPI } from '../services/api'

const BlogPost = () => {
  const { slug } = useParams()
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => blogAPI.getBySlug(slug)
  })

  if (isLoading) return <div className="text-[#b0b3b8] text-center py-12">Loading...</div>
  if (isError || !post) return <div className="text-red-500 text-center py-12">Error loading post.</div>

  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <Link to="/blog" className="text-accent text-xs font-semibold hover:underline mb-6 inline-block">← Back to Blog</Link>
      <h1 className="text-3xl font-bold mb-4 text-white tracking-tight">{post.title}</h1>
      <div className="text-xs text-[#b0b3b8] mb-2">{post.created_at?.slice(0, 10)}</div>
      <div className="text-sm text-[#b0b3b8] mb-8 leading-relaxed">{post.summary}</div>
      <div className="prose prose-invert max-w-none text-[#b0b3b8]" style={{whiteSpace: 'pre-line'}}>{post.content}</div>
      <div className="flex flex-wrap gap-2 text-xs mt-8">
        {(Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? JSON.parse(post.tags || '[]') : [])).map(tag => (
          <span key={tag} className="px-2 py-1 bg-[#18191A] text-accent rounded font-medium tracking-wide border border-[#232427]">{tag}</span>
        ))}
      </div>
    </main>
  )
}

export default BlogPost 