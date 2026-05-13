import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function DeskSetup(props) {
  const { scene } = useGLTF('/models/deskSetup.glb')
  return <primitive object={scene} {...props} />
}

useGLTF.preload('/models/deskSetup.glb')
