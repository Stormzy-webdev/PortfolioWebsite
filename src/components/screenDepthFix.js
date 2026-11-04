// ---------------------------------------------------------------------------
// SCREEN DEPTH FIX (stops the monitor screens going blank in Chrome/Brave/Edge)
// drei's <Html transform> turns 1 metre of the 3D scene into 1 CSS pixel. Our
// monitors are only about half a metre from the camera, so the browser ends
// up maths-ing about HTML that sits half a pixel in front of the viewer's eye
// and is magnified ~1600x. At some window sizes Chromium's 3D maths loses
// precision there, decides the layer is off screen and stops drawing it, so
// the right monitor turned blank or grey.
//
// The fix: blow the whole HTML scene up 1000x around the viewer's eye. Things
// that are 1000x bigger AND 1000x further away look exactly the same, so
// nothing changes visually, but the numbers are now comfortable for the
// browser.
//
// drei rewrites its camera transform every frame, so a MutationObserver adds
// our scale straight after each rewrite (before the browser paints).
//
// Usage: put `ref={screenDepthFixRef}` on the element directly inside <Html transform>.
// ---------------------------------------------------------------------------
const DEPTH_SCALE = 1000
const SCALE_CSS = ` scale3d(${DEPTH_SCALE},${DEPTH_SCALE},${DEPTH_SCALE})`

export function screenDepthFixRef(content) {
  // content -> drei's wrapper div -> inner div -> outer div (holds the camera transform)
  const cameraLayer = content?.parentElement?.parentElement?.parentElement
  if (!cameraLayer) return undefined

  const applyScale = () => {
    const transform = cameraLayer.style.transform
    // the camera transform starts with translateZ(<eye distance>), which puts
    // the origin at the viewer's eye; scaling right after it scales around the eye
    if (!transform || transform.includes('scale3d')) return
    cameraLayer.style.transform = transform.replace(/^(translateZ\([^)]*\))/, `$1${SCALE_CSS}`)
  }

  const observer = new MutationObserver(applyScale)
  observer.observe(cameraLayer, { attributes: true, attributeFilter: ['style'] })
  applyScale()

  // React 19 runs this when the element unmounts
  return () => observer.disconnect()
}
