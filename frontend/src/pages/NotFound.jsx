import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <main className="min-h-[60vh] flex flex-col justify-center items-center py-24 px-4">
      <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
      <p className="text-[#b0b3b8] mb-8">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="bg-accent text-[#18191A] px-6 py-2 rounded font-semibold hover:bg-[#FFD700]/90 transition">Go Home</Link>
    </main>
  )
}

export default NotFound 