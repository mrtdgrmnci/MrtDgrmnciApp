import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Resume', href: '/resume' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ]
  return (
    <header className="w-full border-b border-[#232427] bg-[#18191A]">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-accent">MRT</Link>
        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${location.pathname === item.href ? 'text-accent' : 'text-[#b0b3b8] hover:text-accent'}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header 