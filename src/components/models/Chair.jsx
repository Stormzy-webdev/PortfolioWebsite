import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Chair(props) {
  const { scene } = useGLTF('/models/chair.glb')
  return <primitive object={scene} {...props} />
}

useGLTF.preload('/models/chair.glb')
