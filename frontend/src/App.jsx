import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Layout from './components/Layout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Resume from './pages/Resume'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

function App() {
  return (
    <>
      <Helmet>
        <title>Murat Degirmenci - QA Automation Advisor</title>
        <meta name="description" content="QA Automation Advisor with 10+ years of experience in Selenium, Playwright, Rest Assured, JMeter, and Postman. Expert in test automation frameworks and quality assurance." />
      </Helmet>
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="resume" element={<Resume />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin/*" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App 