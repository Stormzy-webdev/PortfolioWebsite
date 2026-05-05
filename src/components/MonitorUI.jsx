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

const projectGroups = [
  {
    heading: 'Featured',
    items: ['3D Portfolio (selected)'],
  },
  {
    heading: 'Social Media Apps',
    items: ['Social Feed App', 'Messaging UI Clone', 'Dashboard App'],
  },
  {
    heading: '3D Models',
    items: ['Small Tool 1', 'Small Tool 2'],
  },
]

export default function MonitorUI({ visible = false, onTabChange, onProjectHover }) {
  const [activeTab, setActiveTab] = useState('about')
  const active = useMemo(() => sections[activeTab], [activeTab])

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
              {group.items.map((item) => (
                <button
                  className="project-item"
                  key={item}
                  type="button"
                  onMouseEnter={() => onProjectHover?.(item)}
                  onFocus={() => onProjectHover?.(item)}
                >
                  {'-> '}
                  {item}
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
