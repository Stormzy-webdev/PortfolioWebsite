import React from 'react'

export default function IdleDisplay({ visible = false }) {
  return (
    <div className={`right-monitor-idle ${visible ? 'is-visible' : ''}`} aria-hidden={!visible}>
      <div className="right-monitor-idle__pulse" />
      <p className="right-monitor-idle__label">Select a project to preview</p>
    </div>
  )
}
