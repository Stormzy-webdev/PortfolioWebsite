import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The 3D scene is lazy-loaded, so the dev server only discovers these after
  // the page has started, re-bundles them and force-reloads (white screen).
  // Pre-bundling them up front avoids that.
  optimizeDeps: {
    include: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/postprocessing',
      'postprocessing',
    ],
  },
})
