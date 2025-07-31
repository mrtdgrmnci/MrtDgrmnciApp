const Footer = () => (
  <footer className="w-full text-center py-6 text-xs text-[#b0b3b8] border-t border-[#232427] mt-16">
    <div className="flex justify-center gap-4 mb-2">
      {/* Replace with plain text or SVG icons if needed */}
      <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">GitHub</a>
      <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">LinkedIn</a>
      <a href="mailto:mrtdgrmnci@gmail.com" className="hover:text-accent transition">Email</a>
    </div>
    <div>© {new Date().getFullYear()} Test Automation Advisor. All rights reserved.</div>
  </footer>
)

export default Footer 