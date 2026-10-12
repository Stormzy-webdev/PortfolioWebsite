import React, { Suspense, lazy } from 'react'
import BootPanel from './components/BootPanel.jsx'
import MobileFallback from './components/MobileFallback.jsx'
import './App.css'

// Lazy so phones never download three.js or the models (the model files start
// preloading as soon as they are imported).
const PortfolioScene = lazy(() => import('./PortfolioScene.jsx'))

// Touch screens of phone size (either orientation) get the 2D fallback until the
// mobile version exists. Checked once on load so resizing a desktop window
// never unmounts the scene.
const IS_PHONE =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse) and (max-width: 900px), (pointer: coarse) and (max-height: 500px)').matches

function App() {
  if (IS_PHONE) return <MobileFallback />

  return (
    <Suspense fallback={<BootPanel current="fetching render core" />}>
      <PortfolioScene />
    </Suspense>
  )
}

export default App
