import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  return (
    <div className="min-h-screen flex bg-[#18191A] text-white font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col items-center w-20 py-8 border-r border-[#232427] bg-[#18191A]">
        {/* Logo */}
        <a href="/" className="mb-8 text-2xl font-bold tracking-tight text-accent">MD</a>
        {/* Socials */}
        <nav className="flex flex-col gap-6 mt-auto mb-8">
          <a href="https://github.com/mrtdgrmnci" className="text-[#b0b3b8] hover:text-accent" aria-label="GitHub"><svg width="20" height="20" fill="currentColor"><path d="M10 .3a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 10 5.8c.85.004 1.7.11 2.5.32 1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 10 .3"/></svg></a>
          <a href="mailto:mrtdgrmnci@gmail.com" className="text-[#b0b3b8] hover:text-accent" aria-label="Email"><svg width="20" height="20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg></a>
          <a href="tel:+12025679551" className="text-[#b0b3b8] hover:text-accent" aria-label="Phone"><svg width="20" height="20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg></a>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout 