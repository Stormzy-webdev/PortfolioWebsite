import React from 'react'
import { ContactShadows, Environment } from '@react-three/drei'

export default function SceneLighting({ focusMode = 'leftMonitor', rightActive = false }) {
  // Monitor lighting intensities (main visual focus)
  const rightMonitorKeyLight = rightActive ? 0.95 : 0.72
  const rightMonitorFill = rightActive ? 0.44 : 0.3
  const monitorAccentBoost = rightActive ? 0.2 : 0.12

  // PC accent boost (keeps tower glow noticeable without overpowering monitors)
  const pcAccentBoost = rightActive ? 0.3 : 0.22

  return (
    <>
      {/* Keep a very low base so the room is not pitch black */}
      <Environment preset="city" environmentIntensity={0.18} background={false} />
      <ambientLight intensity={0.035} color="#9fb8d6" />

      {/* LEFT MONITOR cyan glow (primary screen emitter) */}
      <pointLight
        position={[-1.01, 1.05, 0.84]}
        intensity={focusMode === 'leftMonitor' ? 1.08 : 0.82}
        color="#6de8ff"
        distance={2.45}
        decay={2}
      />

      {/* RIGHT MONITOR cyan core glow (project showcase focus) */}
      <pointLight
        position={[-0.2, 1.02, 0.38]}
        intensity={rightMonitorKeyLight}
        color="#7de9ff"
        distance={2.2}
        decay={2}
      />

      {/* RIGHT MONITOR purple accent (cyberpunk color separation) */}
      <pointLight
        position={[0.16, 1.04, 0.32]}
        intensity={0.34 + monitorAccentBoost}
        color="#8d6fff"
        distance={1.95}
        decay={2}
      />

      {/* Desk bounce from screens (raise if keyboard/desk gets too dark) */}
      <pointLight
        position={[-0.74, 0.76, 0.42]}
        intensity={rightMonitorFill}
        color="#d8ebff"
        distance={2.15}
        decay={2}
      />

      {/* PC TOWER cyan spill */}
      <pointLight
        position={[0.55, 0.78, -0.06]}
        intensity={0.34 + pcAccentBoost}
        color="#45d9ff"
        distance={2.15}
        decay={2}
      />

      {/* PC TOWER magenta/purple spill */}
      <pointLight
        position={[0.44, 0.95, -0.24]}
        intensity={0.26 + pcAccentBoost * 0.95}
        color="#c862ff"
        distance={1.95}
        decay={2}
      />

      {/* No extra room/rim lights: monitors + PC are the visible emitters */}

      {/* Subtle contact under setup so assets feel anchored */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.28}
        scale={6.5}
        blur={2.7}
        far={2.6}
        resolution={1024}
        frames={1}
      />
    </>
  )
}
