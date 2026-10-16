import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// No <StrictMode>: in dev it unmounts/remounts components as a check, and React
// Three Fiber treats that fake unmount as real and destroys the WebGL context
// ("Context Lost", white screen). Production builds never double-mount.
createRoot(document.getElementById('root')).render(<App />)
