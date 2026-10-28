import React, { Suspense, lazy } from 'react'
import BootPanel from './components/BootPanel.jsx'
import MobileFallback from './components/MobileFallback.jsx'
import './App.css'

// Lazy so phones (and the quick view) never download three.js or the models
// (the model files start preloading as soon as they are imported).
const PortfolioScene = lazy(() => import('./PortfolioScene.jsx'))

// Touch screens of phone size (either orientation) get the 2D version until
// the mobile version exists. Checked once on load so resizing a desktop
// window never unmounts the scene.
const IS_PHONE =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse) and (max-width: 900px), (pointer: coarse) and (max-height: 500px)').matches

// "Quick view": the same 2D version on desktop, for recruiters in a hurry or
// on slow laptops. Opened from the link on the landing screen, or by going to
// the site with ?view=quick at the end of the address.
const IS_QUICK_VIEW =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('view') === 'quick'

function App() {
  if (IS_PHONE) return <MobileFallback variant="phone" />
  if (IS_QUICK_VIEW) return <MobileFallback variant="desktop" />

  return (
    <Suspense fallback={<BootPanel current="fetching render core" />}>
      <PortfolioScene />
    </Suspense>
  )
}

export default App
