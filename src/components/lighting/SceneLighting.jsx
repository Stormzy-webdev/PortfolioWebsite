import React from 'react'
import { ContactShadows, Environment } from '@react-three/drei'

export default function SceneLighting({ focusMode = 'leftMonitor', rightActive = false }) {
  const rightMonitorKeyLight = rightActive ? 0.62 : 0.36
  const rightMonitorFill = rightActive ? 0.22 : 0.12

  return (
    <>
      {/* HDRI-based ambient/reflection lighting for believable material response */}
      <Environment preset="night" environmentIntensity={0.6} background={false} />

      {/* Soft moonlight / exterior feel */}
      <directionalLight
        castShadow
        position={[3.4, 5.8, 2.1]}
        intensity={0.82}
        color="#dbe7ff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={18}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.00015}
        shadow-normalBias={0.02}
      />

      {/* Gentle cool fill to keep dark regions readable */}
      <hemisphereLight args={['#9fb8ff', '#0f1118', 0.26]} />

      {/* Left monitor emphasis for initial camera framing */}
      <pointLight
        position={[-1.02, 1.06, 0.92]}
        intensity={focusMode === 'leftMonitor' ? 0.58 : 0.44}
        color="#8fffb2"
        distance={2.1}
        decay={2}
      />

      {/* Right monitor reactive glow that strengthens in projects mode */}
      <pointLight
        position={[-0.22, 1.02, 0.44]}
        intensity={rightMonitorKeyLight}
        color="#7de9ff"
        distance={1.7}
        decay={2}
      />

      {/* Desk-level bounce to ground peripherals */}
      <pointLight
        position={[-0.75, 0.74, 0.45]}
        intensity={rightMonitorFill}
        color="#d7f4ff"
        distance={1.9}
        decay={2}
      />

      {/* Subtle contact under setup so assets feel anchored */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.35}
        scale={6.5}
        blur={2.3}
        far={2.6}
        resolution={1024}
        frames={1}
      />
    </>
  )
}
