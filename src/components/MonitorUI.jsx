import React, { useMemo, useRef, useState } from 'react'

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
    body: 'Email: ismailstorm08@gmail.com  |  GitHub: github.com/Stormzy-webdev |  LinkedIn: linkedin.com/in/yourname',
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

export default function MonitorUI({
  visible = false,
  onTabChange,
  projects = [],
  selectedProjectId,
  onSelectProject,
}) {
  const [activeTab, setActiveTab] = useState('about')
  const projectsScrollRef = useRef(null)
  const active = useMemo(() => sections[activeTab], [activeTab])
  const projectGroups = useMemo(() => buildProjectGroups(projects), [projects])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
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
                    onMouseEnter={() => onSelectProject?.(project.id)}
                    onFocus={() => onSelectProject?.(project.id)}
                    onClick={() => onSelectProject?.(project.id)}
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
          </article>
        )}
      </section>
    </div>
  )
}
