import React, { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useProjectPreview from './useProjectPreview'

export default function ProjectPreview({ geometry, transform, selectedProject, isIdle, active = false }) {
  const materialRef = useRef()
  const preview = useProjectPreview({
    selectedProject,
    screenAspect: transform.screenAspect,
    isIdle,
  })

  const targetOpacity = active ? 1 : 0.86

  useEffect(() => {
    if (!materialRef.current) return
    materialRef.current.opacity = 0.08
  }, [preview.transitionKey])

  useFrame((_, delta) => {
    const material = materialRef.current
    if (!material) return
    material.opacity = THREE.MathUtils.damp(material.opacity, targetOpacity, 6.5, delta)
  })

  const emissiveIntensity = useMemo(() => {
    if (preview.type === 'idle') return active ? 0.88 : 0.68
    if (preview.type === 'video') return active ? 1.42 : 1.04
    return active ? 1.24 : 0.92
  }, [active, preview.type])

  return (
    <mesh
      geometry={geometry}
      position={transform.position}
      rotation={transform.rotation}
      scale={transform.scale}
    >
      <meshStandardMaterial
        ref={materialRef}
        transparent
        map={preview.texture || null}
        emissiveMap={preview.texture || null}
        emissive={new THREE.Color('#b18eff')}
        emissiveIntensity={emissiveIntensity}
        color={preview.type === 'idle' ? '#6f8ea7' : '#ffffff'}
        metalness={0.08}
        roughness={0.2}
        toneMapped={false}
      />
    </mesh>
  )
}
