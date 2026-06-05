import React, { useMemo } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import ProjectPreview from './ProjectPreview'
import ProjectInfoOverlay from './ProjectInfoOverlay'

const UI_POSITION = [0, 0.0, 0.001]
const UI_SCALE = 0.05
const UI_ROTATION = [0, 1.4, 0]
const MATRIX_CHARS = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-<>'
const MATRIX_COLUMN_COUNT = 18

function MatrixIdle() {
  const columns = Array.from({ length: MATRIX_COLUMN_COUNT }, (_, i) => {
    let text = ''
    for (let j = 0; j < 28; j += 1) {
      text += MATRIX_CHARS[(i * 7 + j * 11) % MATRIX_CHARS.length]
    }
    return { text, delay: (i % 6) * -0.6, duration: 3.2 + (i % 5) * 0.45 }
  })

  return (
    <div className="matrix-idle" aria-hidden="true">
      {columns.map((column, index) => (
        <span
          key={index}
          className="matrix-column"
          style={{ '--delay': `${column.delay}s`, '--duration': `${column.duration}s` }}
        >
          {column.text}
        </span>
      ))}
    </div>
  )
}

export default function RightMonitorDisplay({
  screen,
  selectedProject,
  mode = 'off',
  booting = false,
}) {
  const showProjectUI = mode === 'project'
  const showStandbyUI = mode === 'standby'
  const showIdleMatrix = mode === 'idle'
  const showOffMatrix = mode === 'off'
  const isActive = showProjectUI
  const shouldRenderPreview = showProjectUI || showStandbyUI || showIdleMatrix

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
      {shouldRenderPreview ? (
        <ProjectPreview
          geometry={screen.geometry}
          transform={transform}
          selectedProject={selectedProject}
          isIdle={!showProjectUI}
          active={isActive}
        />
      ) : null}

      <mesh
        geometry={screen.geometry}
        position={transform.position}
        rotation={transform.rotation}
        scale={transform.scale}
      >
        <meshBasicMaterial transparent opacity={0.06} color="#c2ecff" toneMapped={false} />
      </mesh>

      <group position={transform.position} rotation={transform.rotation} scale={transform.scale}>
        <Html transform position={UI_POSITION} rotation={UI_ROTATION} scale={UI_SCALE}>
          <div className={`right-monitor-overlay ${isActive ? 'is-active' : ''}`}>
            <div className="right-monitor-overlay__scan" />
            {booting && <div className="monitor-boot-flicker" aria-hidden="true" />}
            {showOffMatrix || showIdleMatrix ? (
              <MatrixIdle />
            ) : showStandbyUI ? (
              <ProjectInfoOverlay project={selectedProject} isIdle />
            ) : showProjectUI ? (
              <>
                <ProjectInfoOverlay project={selectedProject} isIdle={false} />
              </>
            ) : null}
          </div>
        </Html>
      </group>
    </>
  )
}
