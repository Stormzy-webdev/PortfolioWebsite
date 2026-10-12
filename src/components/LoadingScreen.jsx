import React from 'react'
import { useProgress } from '@react-three/drei'
import BootPanel from './BootPanel.jsx'

function fileName(url) {
  if (!url) return ''
  return decodeURIComponent(url.split('?')[0].split('/').pop())
}

export default function LoadingScreen({ ready = false }) {
  const { progress, item } = useProgress()

  // Loader progress can briefly hit 100 between files, so only the scene
  // actually mounting (ready) is allowed to report completion.
  const percent = ready ? 100 : Math.min(99, Math.floor(progress))

  return <BootPanel percent={percent} current={fileName(item)} ready={ready} />
}
