import React, { useMemo } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import ScreenGlow from './ScreenGlow'
import ProjectInfoOverlay from './ProjectInfoOverlay'
import MatrixRain from '../MatrixRain'
import { SCREEN_TEXT_ZOOM } from '../screenSharpness'
import { screenDepthFixRef } from '../screenDepthFix'

// ===========================================================================
// RIGHT MONITOR
// Puts together the right monitor's screen:
//   - ScreenGlow: the glowing 3D surface
//   - an HTML layer on top showing either Matrix rain (before the monitors
//     boot, or on tabs other than Projects) or the project showcase
//     (ProjectInfoOverlay) while the Projects tab is open
// `mode` comes from PortfolioScene: 'off' | 'idle' | 'project'.
// ===========================================================================

const UI_POSITION = [0, 0.0, 0.001]
const UI_SCALE = 0.05
const UI_ROTATION = [0, 1.4, 0]
export default function RightMonitorDisplay({
  screen,
  selectedProject,
  mode = 'off',
  booting = false,
}) {
  const showProjectUI = mode === 'project'
  const isActive = showProjectUI
  // The glowing surface only shows once the monitors are on
  const showGlow = mode === 'project' || mode === 'idle'

  const transform = useMemo(() => {
    const screenAspect = (() => {
      if (!screen?.geometry) return 16 / 9
      const bbox = new THREE.Box3().setFromBufferAttribute(screen.geometry.attributes.position)
      const size = new THREE.Vector3()
      bbox.getSize(size)
      return size.x > 0 && size.y > 0 ? size.x / size.y : 16 / 9
    })()

    return {
      position: screen.position,
      rotation: screen.rotation,
      scale: screen.scale,
      screenAspect,
    }
  }, [screen])

  return (
    <>
      {showGlow && (
        <ScreenGlow geometry={screen.geometry} transform={transform} active={isActive} refreshKey={selectedProject?.id} />
      )}

      <mesh
        geometry={screen.geometry}
        position={transform.position}
        rotation={transform.rotation}
        scale={transform.scale}
      >
        <meshBasicMaterial transparent opacity={0.06} color="#c2ecff" toneMapped={false} />
      </mesh>

      <group position={transform.position} rotation={transform.rotation} scale={transform.scale}>
        {/* laid out bigger + scaled down = sharper text (see screenSharpness.js) */}
        <Html transform position={UI_POSITION} rotation={UI_ROTATION} scale={UI_SCALE / SCREEN_TEXT_ZOOM}>
          <div
            // keeps Chromium from dropping this steeply angled screen (see screenDepthFix.js)
            ref={screenDepthFixRef}
            className={`right-monitor-overlay ${isActive ? 'is-active' : ''}`}
            style={{ zoom: SCREEN_TEXT_ZOOM }}
          >
            <div className="right-monitor-overlay__scan" />
            {booting && <div className="monitor-boot-flicker" aria-hidden="true" />}
            {showProjectUI ? <ProjectInfoOverlay project={selectedProject} /> : <MatrixRain />}
          </div>
        </Html>
      </group>
    </>
  )
}
