import React, { useMemo, useRef } from 'react'
import { profile } from '../data/profile.js'

// Contact line built from data/profile.js (the same details the terminal and
// the phone screen use), so contact info only ever needs updating in one place.
const stripProtocol = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
const contactBody = [
  profile.email && `Email: ${profile.email}`,
  profile.github && `GitHub: ${stripProtocol(profile.github)}`,
  profile.linkedin && `LinkedIn: ${stripProtocol(profile.linkedin)}`,
]
  .filter(Boolean)
  .join('  |  ')

const sections = {
  about: {
    title: 'About',
    body: 'Frontend-focused developer crafting immersive web experiences with performant UI systems and polished interaction design.',
  },
  projects: {
    title: 'Projects',
    body: '',
  },
  skills: {
    title: 'Skills',
    body: 'Focused on production-ready frontend systems, modern web graphics, and scalable component architecture.',
  },
  experience: {
    title: 'Experience',
    body: 'Building interactive web products with attention to UX detail, performance, and clean engineering workflows.',
  },
  contact: {
    title: 'Contact',
    body: contactBody,
  },
}

function buildProjectGroups(projects) {
  const grouped = projects.reduce((acc, project) => {
    const key = project.category || 'Other'
    if (!acc[key]) acc[key] = []
    acc[key].push(project)
    return acc
  }, {})

  return Object.entries(grouped).map(([heading, items]) => ({ heading, items }))
}

// The open tab is owned by PortfolioScene (passed in as activeTab) rather than
// remembered here, so the camera, the right monitor and this screen always
// agree, and Exit can reset everything back to About.
export default function MonitorUI({
  visible = false,
  activeTab = 'about',
  onTabChange,
  onOpenTerminal,
  onProjectHover,
  onProjectSelect,
  projects = [],
  selectedProjectId,
}) {
  const projectsScrollRef = useRef(null)
  const active = useMemo(() => sections[activeTab], [activeTab])
  const projectGroups = useMemo(() => buildProjectGroups(projects), [projects])

  const handleTabChange = (tab) => {
    onTabChange?.(tab)
  }

  const handleProjectsWheel = (event) => {
    const container = projectsScrollRef.current
    if (!container) return
    event.preventDefault()
    event.stopPropagation()
    container.scrollTop += event.deltaY * 0.08
  }

  return (
    <div className={`monitor-ui-panel ${visible ? 'monitor-ui-visible' : ''}`}>
      <header className="monitor-brand">
        <p className="monitor-brand__kicker">Portfolio OS</p>
        <h2 className="monitor-brand__name">Storm Ismail</h2>
      </header>

      {/* Second way into the keyboard Easter egg, for visitors who used Start */}
      <button
        type="button"
        className="monitor-terminal-launch"
        onClick={() => onOpenTerminal?.()}
        aria-label="Open the terminal"
      >
        &gt;_ terminal
      </button>

      <div className="monitor-tabs">
        <button
          className={`monitor-tab ${activeTab === 'about' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('about')}
        >
          About
        </button>
        <button
          className={`monitor-tab ${activeTab === 'projects' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('projects')}
        >
          Projects
        </button>
        <button
          className={`monitor-tab ${activeTab === 'skills' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('skills')}
        >
          Skills
        </button>
        <button
          className={`monitor-tab ${activeTab === 'experience' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('experience')}
        >
          Experience
        </button>
        <button
          className={`monitor-tab ${activeTab === 'contact' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('contact')}
        >
          Contact
        </button>
      </div>

      <section className="monitor-content">
        <h3 className="monitor-title" data-text={active.title}>
          {active.title}
        </h3>

        {activeTab === 'projects' ? (
          <div className="monitor-projects-wrap">
            <div className="monitor-projects-head">
              <p className="monitor-projects-head__kicker">Project Catalog</p>
              <p className="monitor-projects-head__hint">Hover or click to preview on right monitor</p>
            </div>
              <div
                ref={projectsScrollRef}
                className="monitor-projects"
                aria-label="Project categories"
                onWheel={handleProjectsWheel}
              >
            {projectGroups.map((group) => (
              <section className="project-group" key={group.heading}>
                <h4 className="project-heading">
                  <span>{group.heading}</span>
                  <span className="project-heading__count">{group.items.length.toString().padStart(2, '0')}</span>
                </h4>
                {group.items.map((project) => (
                  <button
                    className={`project-item ${selectedProjectId === project.id ? 'is-selected' : ''}`}
                    key={project.id}
                    type="button"
                    data-text={project.title}
                    onMouseEnter={() => onProjectHover?.(project.id)}
                    onFocus={() => onProjectHover?.(project.id)}
                    onClick={() => onProjectSelect?.(project.id)}
                  >
                    <span className="project-item__arrow">{'->'}</span>
                    <span className="project-item__body">
                      <span className="project-item__title">{project.title}</span>
                      {project.subtitle ? <span className="project-item__subtitle">{project.subtitle}</span> : null}
                      {Array.isArray(project.tech) && project.tech.length ? (
                        <span className="project-item__tags">
                          {project.tech.slice(0, 3).map((tag) => (
                            <span className="project-item__tag" key={`${project.id}-${tag}`}>
                              {tag}
                            </span>
                          ))}
                        </span>
                      ) : null}
                    </span>
                  </button>
                ))}
              </section>
            ))}
            </div>
          </div>
        ) : (
          <article className="monitor-card">
            <p className="monitor-copy">{active.body}</p>
            {activeTab === 'contact' && profile.cv && (
              <a className="monitor-cv-link" href={profile.cv} target="_blank" rel="noreferrer">
                Download CV (PDF)
              </a>
            )}
          </article>
        )}
      </section>
    </div>
  )
}
