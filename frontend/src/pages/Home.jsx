import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Murat Degirmenci - QA Automation Advisor</title>
        <meta name="description" content="QA Automation Advisor with 10+ years of experience in Selenium, Playwright, Rest Assured, JMeter, and Postman. Expert in test automation frameworks and quality assurance." />
      </Helmet>
      {/* Minimalist Hero Section */}
      <section className="min-h-[60vh] flex flex-col justify-center items-start max-w-3xl mx-auto py-24">
        <span className="text-accent text-xs font-semibold mb-4 tracking-widest uppercase">QA Automation Advisor</span>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Murat Degirmenci<br />
          <span className="text-accent">10+ Years Experience</span>
        </h1>
        <p className="text-[#b0b3b8] text-lg mb-8 max-w-xl">
          QA Advisor at General Dynamics specializing in test management and AI-powered testing solutions. Expert in Selenium, Playwright, Rest Assured, JMeter, and Postman with focus on cybersecurity testing for government applications.
        </p>
        <div className="flex gap-4">
          <Link to="/projects" className="px-6 py-3 bg-accent text-[#18191A] font-semibold rounded hover:opacity-90 transition">View Projects</Link>
          <Link to="/contact" className="px-6 py-3 border border-accent text-accent font-semibold rounded hover:bg-accent hover:text-[#18191A] transition">Contact</Link>
        </div>
      </section>
      {/* Skills & Expertise Section */}
      <section className="max-w-4xl mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#232427] rounded p-6">
          <h2 className="text-sm font-semibold text-accent mb-2 tracking-widest uppercase">Core Technologies</h2>
          <div className="text-sm text-[#b0b3b8] mb-1">AI Testing</div>
          <div className="text-xs text-[#b0b3b8]">Intelligent Test Automation</div>
          <div className="mt-4 text-sm text-[#b0b3b8] mb-1">Selenium WebDriver</div>
          <div className="text-xs text-[#b0b3b8]">UI Automation Framework</div>
          <div className="mt-4 text-sm text-[#b0b3b8] mb-1">Playwright</div>
          <div className="text-xs text-[#b0b3b8]">Modern E2E Testing</div>
        </div>
        <div className="bg-[#232427] rounded p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-accent mb-2 tracking-widest uppercase">Security & Management</h2>
            <div className="text-sm text-[#b0b3b8] mb-2">Cybersecurity testing, test management, and government clearance compliance for defense applications.</div>
          </div>
          <Link to="/projects" className="text-accent text-xs font-semibold mt-4 hover:underline">View Projects</Link>
        </div>
      </section>
    </>
  )
}

export default Home 