import React from 'react'
import { profile } from '../data/profile.js'

// ---------------------------------------------------------------------------
// AVAILABILITY BADGE
// A small "● Open to junior developer roles · …" pill with a softly pulsing
// green dot, so recruiters can see straight away that Storm is available.
// The text comes from profile.availability (set it to null to hide the badge
// everywhere). `className` lets each place size/position it.
// ---------------------------------------------------------------------------
export default function AvailabilityBadge({ className = '' }) {
  if (!profile.availability) return null

  return (
    <p className={`availability-badge ${className}`}>
      <span className="availability-badge__dot" aria-hidden="true" />
      {profile.availability}
    </p>
  )
}
