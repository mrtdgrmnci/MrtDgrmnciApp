import { useQuery } from '@tanstack/react-query'
import { resumeAPI } from '../services/api'

const Resume = () => {
  console.log('Resume component rendering...')
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['resume'],
    queryFn: resumeAPI.getAll,
    onSuccess: (data) => {
      console.log('Resume loaded successfully:', data)
    },
    onError: (error) => {
      console.error('Error loading resume:', error)
    }
  })
  
  console.log('Resume component render:', { data, isLoading, isError, error })
  
  const { experience = [], education = [], skills = [] } = data || {}

  console.log('Resume data parsed:', { experience, education, skills })

  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-10 text-white tracking-tight">Resume</h1>
      <section className="mb-14">
        <h2 className="text-lg font-semibold text-accent mb-5 tracking-wide uppercase">Experience</h2>
        <ul className="space-y-7">
          {experience.map(exp => (
            <li key={exp.id} className="bg-[#232427] rounded-xl p-6 border border-[#232427] shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                <span className="font-semibold text-white text-base">{exp.title}</span>
                <span className="text-xs text-[#b0b3b8]">{exp.company} • {exp.location}</span>
              </div>
              <div className="text-xs text-[#b0b3b8] mb-1">{exp.start_date} - {exp.end_date || 'Present'}</div>
              <div className="text-sm text-[#b0b3b8] mb-2 leading-relaxed">{exp.description}</div>
              <div className="flex flex-wrap gap-2 text-xs mt-2">
                {Array.isArray(exp.technologies) ? exp.technologies : (typeof exp.technologies === 'string' ? JSON.parse(exp.technologies || '[]') : []).map(tech => (
                  <span key={tech} className="px-2 py-1 bg-[#18191A] text-accent rounded font-medium tracking-wide border border-[#232427]">{tech}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-14">
        <h2 className="text-lg font-semibold text-accent mb-5 tracking-wide uppercase">Education</h2>
        <ul className="space-y-7">
          {education.map(edu => (
            <li key={edu.id} className="bg-[#232427] rounded-xl p-6 border border-[#232427] shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                <span className="font-semibold text-white text-base">{edu.degree}</span>
                <span className="text-xs text-[#b0b3b8]">{edu.institution} • {edu.location}</span>
              </div>
              <div className="text-xs text-[#b0b3b8] mb-1">{edu.start_date} - {edu.end_date || 'Present'}</div>
              <div className="text-sm text-[#b0b3b8] leading-relaxed">{edu.description}</div>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-accent mb-5 tracking-wide uppercase">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill.id} className="px-3 py-1 bg-[#232427] text-accent rounded text-xs font-medium border border-[#232427] tracking-wide">{skill.name}</span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Resume 