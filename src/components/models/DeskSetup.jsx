import React, { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { rgbHue } from '../lighting/rgbCycle.js'

// Parts of the model whose glowing pieces should cycle colour (node names in
// deskSetup.glb). Only pieces that already glow with a texture are cycled, so
// the solid orange/green status LEDs on the tower stay their normal colour.
const RGB_PARTS = ['tower', 'Speakers']

// How colourful the RGB tint is (0 = keep the original texture colours,
// 1 = fully the cycling colour) and how bright it is.
const RGB_SATURATION = 0.7
const RGB_LIGHTNESS = 0.6

export default function DeskSetup(props) {
  const { scene } = useGLTF('/models/deskSetup.glb')
  const { enhancedScene, rgbMaterials } = useMemo(() => {
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

    // Collect the glowing (emissive-textured) materials on the PC and speakers.
    const glowing = new Set()
    for (const partName of RGB_PARTS) {
      next.getObjectByName(partName)?.traverse((node) => {
        if (node.isMesh && node.material?.emissiveMap) glowing.add(node.material)
      })
    }

    return { enhancedScene: next, rgbMaterials: [...glowing] }
  }, [scene])

  // ---------------------------------------------------------------------------
  // RGB CYCLING
  // Every frame, tint the PC/speaker glow with the shared cycling colour, so the
  // fans and strips slowly fade through the rainbow (see lighting/rgbCycle.js).
  // ---------------------------------------------------------------------------
  const tint = useMemo(() => new THREE.Color(), [])
  useFrame(({ clock }) => {
    tint.setHSL(rgbHue(clock.elapsedTime), RGB_SATURATION, RGB_LIGHTNESS)
    for (const material of rgbMaterials) material.emissive.copy(tint)
  })

  return <primitive object={enhancedScene} {...props} />
}

useGLTF.preload('/models/deskSetup.glb')
