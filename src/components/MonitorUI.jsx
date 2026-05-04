import React, { useMemo, useState } from 'react'

const sections = {
  about: {
    title: 'About Me',
    body: 'I am a frontend-focused developer building immersive and interactive web experiences.',
  },
  projects: {
    title: 'Projects',
    body: 'Portfolio Website, 3D Product Showcase, and a clean e-commerce UI with custom animations.',
  },
  contact: {
    title: 'Contact',
    body: 'Email: ismailstorm08@email.com | GitHub: github.com/yourname | LinkedIn: linkedin.com/in/yourname',
  },
}

export default function MonitorUI({ visible = false }) {
  const [activeTab, setActiveTab] = useState('about')
  const active = useMemo(() => sections[activeTab], [activeTab])

  return (
    <div className={`monitor-ui-panel ${visible ? 'monitor-ui-visible' : ''}`}>
      <div className="monitor-tabs">
        <button
          className={`monitor-tab ${activeTab === 'about' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button
          className={`monitor-tab ${activeTab === 'projects' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={`monitor-tab ${activeTab === 'contact' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact
        </button>
      </div>

      <h3 className="monitor-title" data-text={active.title}>
        {active.title}
      </h3>
      <p className="monitor-copy">{active.body}</p>
    </div>
  )
}
