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

export default function MonitorUI() {
  const [activeTab, setActiveTab] = useState('about')
  const active = useMemo(() => sections[activeTab], [activeTab])

  return (
    <div
      style={{
        width: '416px',
        height: '267px',
        background: 'linear-gradient(180deg, #101820 0%, #0b1117 100%)',
        color: '#b7ffbf',
        border: '2px solid #39ff14',
        borderRadius: '1px',
        padding: '12px',
        boxSizing: 'border-box',
        fontFamily: 'monospace',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <button onClick={() => setActiveTab('about')}>About</button>
        <button onClick={() => setActiveTab('projects')}>Projects</button>
        <button onClick={() => setActiveTab('contact')}>Contact</button>
      </div>

      <h3 style={{ margin: 0, fontSize: '16px' }}>{active.title}</h3>
      <p style={{ marginTop: '8px', fontSize: '12px', lineHeight: 1.45 }}>{active.body}</p>
    </div>
  )
}

