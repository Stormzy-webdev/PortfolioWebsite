import React from 'react'
import { Sparkles } from '@react-three/drei'

// ---------------------------------------------------------------------------
// DUST PARTICLES
// Faint specks of dust drifting slowly through the air around the desk, lit
// up by the monitor glow. Adds depth and makes the room feel lived-in.
//
// The cloud is a box centred on `position` and sized by `scale` (x, y, z in
// metres). It sits above and behind the monitors so specks don't drift right
// in front of the camera when zoomed in on the screens.
// ---------------------------------------------------------------------------
export default function DustParticles() {
  return (
    <Sparkles
      position={[-0.35, 1.45, 0.2]}
      scale={[1.6, 1.3, 2.4]}
      count={70}
      size={1.6}
      speed={0.12}
      opacity={0.35}
      noise={0.6}
      color="#cfeaff"
    />
  )
}
