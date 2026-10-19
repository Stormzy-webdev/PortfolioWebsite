import React, { useEffect, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
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

// Glow colour for the keyboard when the visitor hovers over it.
const KEYBOARD_HOVER_GLOW = '#1f8a43'

// keyboardInteractive: true while the visitor is in the room view (not zoomed in)
// onKeyboardClick: called when the keyboard is clicked (opens the terminal)
export default function DeskSetup({ keyboardInteractive = false, onKeyboardClick, ...props }) {
  const { scene } = useGLTF('/models/deskSetup.glb')
  const { enhancedScene, rgbMaterials, keyboard, keyboardMaterials, keyboardLabelPosition } = useMemo(() => {
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

    // The keyboard gets its own copy of its material (it's shared with the
    // mouse in the model) so only the keyboard lights up on hover.
    const keyboardNode = next.getObjectByName('keyboard')
    const ownMaterials = []
    keyboardNode?.traverse((node) => {
      if (!node.isMesh) return
      node.material = node.material.clone()
      // Glow strength for hover; it only shows when the glow colour isn't black.
      node.material.emissiveIntensity = 1.2
      ownMaterials.push(node.material)
    })

    // Where to show the "Open terminal" label: just above the keyboard.
    next.updateMatrixWorld(true)
    const labelPosition = keyboardNode
      ? new THREE.Box3().setFromObject(keyboardNode).getCenter(new THREE.Vector3()).add(new THREE.Vector3(0, 0.13, 0))
      : null

    return {
      enhancedScene: next,
      rgbMaterials: [...glowing],
      keyboard: keyboardNode,
      keyboardMaterials: ownMaterials,
      keyboardLabelPosition: labelPosition,
    }
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

  // ---------------------------------------------------------------------------
  // CLICKABLE KEYBOARD
  // In the room view, hovering the keyboard makes it glow green, switches the
  // cursor to a hand and shows an "Open terminal" label. Clicking it opens the
  // hidden terminal on the monitor (handled by PortfolioScene).
  // Only the closest thing under the cursor counts, so the keyboard can't be
  // clicked through other objects, and a click that was really a camera drag
  // is ignored.
  // ---------------------------------------------------------------------------
  const [keyboardHovered, setKeyboardHovered] = useState(false)
  const showHover = keyboardInteractive && keyboardHovered

  const isKeyboard = (object) => {
    for (let node = object; node; node = node.parent) if (node === keyboard) return true
    return false
  }

  // Glow on/off is applied in the frame loop (the three.js way to change materials).
  useFrame(() => {
    for (const material of keyboardMaterials) {
      material.emissive.set(showHover ? KEYBOARD_HOVER_GLOW : '#000000')
    }
  })

  useEffect(() => {
    document.body.style.cursor = showHover ? 'pointer' : ''
  }, [showHover])

  // Never leave a hand cursor behind once this unmounts.
  useEffect(() => () => {
    document.body.style.cursor = ''
  }, [])

  return (
    <>
      <primitive
        object={enhancedScene}
        {...props}
        onPointerMove={(event) => {
          if (!keyboardInteractive) return
          setKeyboardHovered(isKeyboard(event.intersections[0]?.object))
        }}
        onPointerOut={() => setKeyboardHovered(false)}
        onClick={(event) => {
          if (!keyboardInteractive || event.delta > 4) return
          if (!isKeyboard(event.intersections[0]?.object)) return
          event.stopPropagation()
          setKeyboardHovered(false)
          onKeyboardClick?.()
        }}
      />

      {showHover && keyboardLabelPosition && (
        <Html position={keyboardLabelPosition} center style={{ pointerEvents: 'none' }}>
          <div className="keyboard-tooltip">⌨ Open terminal</div>
        </Html>
      )}
    </>
  )
}

useGLTF.preload('/models/deskSetup.glb')
