import React from 'react'

// ---------------------------------------------------------------------------
// EXIT BUTTON
// Shown in the top-left corner while the visitor is zoomed in on the monitors.
// Clicking it (or pressing Escape, handled in PortfolioScene) flies the camera
// back out to the room and brings the Start button back.
// ---------------------------------------------------------------------------
export default function ExitButton({ onExit }) {
  return (
    <button
      type="button"
      className="hud-button exit-button"
      data-text="Exit"
      onClick={onExit}
      aria-label="Exit monitor view (Escape)"
    >
      <span className="exit-button__icon" aria-hidden="true">⏻</span>
      <span className="exit-button__label">Exit</span>
      <kbd className="exit-button__key" aria-hidden="true">Esc</kbd>
    </button>
  )
}
