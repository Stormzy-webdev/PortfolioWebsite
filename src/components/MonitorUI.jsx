import React, { useMemo, useState } from 'react'

const sections = {
  about: {
    title: 'About Me',
    body: 'I am a frontend-focused developer building immersive and interactive web experiences.',
  },
  projects: {
    title: 'Projects',
    body: '',
  },
  contact: {
    title: 'Contact',
    body: 'Email: ismailstorm08@email.com | GitHub: github.com/yourname | LinkedIn: linkedin.com/in/yourname',
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
  const active = useMemo(() => sections[activeTab], [activeTab])
  const projectGroups = useMemo(() => buildProjectGroups(projects), [projects])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    onTabChange?.(tab)
  }

  return (
    <div className={`monitor-ui-panel ${visible ? 'monitor-ui-visible' : ''}`}>
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
          className={`monitor-tab ${activeTab === 'contact' ? 'is-active' : ''}`}
          onClick={() => handleTabChange('contact')}
        >
          Contact
        </button>
      </div>

      <h3 className="monitor-title" data-text={active.title}>
        {active.title}
      </h3>

      {activeTab === 'projects' ? (
        <div className="monitor-projects" aria-label="Project categories">
          {projectGroups.map((group) => (
            <section className="project-group" key={group.heading}>
              <h4 className="project-heading">[{group.heading}]</h4>
              {group.items.map((project) => (
                <button
                  className={`project-item ${selectedProjectId === project.id ? 'is-selected' : ''}`}
                  key={project.id}
                  type="button"
                  onMouseEnter={() => onSelectProject?.(project.id)}
                  onFocus={() => onSelectProject?.(project.id)}
                  onClick={() => onSelectProject?.(project.id)}
                >
                  {'-> '}
                  {project.title}
                </button>
              ))}
            </section>
          ))}
        </div>
      ) : (
        <p className="monitor-copy">{active.body}</p>
      )}
    </div>
  )
}
