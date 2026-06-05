import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function DeskSetup(props) {
  const { scene } = useGLTF('/models/deskSetup.glb')
  const enhancedScene = useMemo(() => {
    const next = scene.clone(true)
    const neonA = new THREE.Color('#52deff')
    const neonB = new THREE.Color('#b868ff')
    const neonC = new THREE.Color('#ff4fd8')

    next.traverse((node) => {
      if (!node.isMesh) return

      node.castShadow = false
      node.receiveShadow = true

      const material = node.material
      if (!material) return

      const label = `${node.name || ''} ${material.name || ''}`.toLowerCase()
      const isPcLight =
        label.includes('rgb') ||
        label.includes('led') ||
        label.includes('light') ||
        label.includes('fan') ||
        label.includes('screen') ||
        label.includes('glass')

      if (isPcLight && material.isMeshStandardMaterial) {
        material.toneMapped = false
        if (!material.emissive) material.emissive = new THREE.Color('#000000')

        if (label.includes('fan') || label.includes('led')) {
          material.emissive.copy(neonA)
          material.emissiveIntensity = 1.35
        } else if (label.includes('screen') || label.includes('glass')) {
          material.emissive.copy(neonB)
          material.emissiveIntensity = 0.5
        } else {
          material.emissive.copy(neonC)
          material.emissiveIntensity = 0.7
        }
      }
    })

    return next
  }, [scene])

  return <primitive object={enhancedScene} {...props} />
}

useGLTF.preload('/models/deskSetup.glb')
