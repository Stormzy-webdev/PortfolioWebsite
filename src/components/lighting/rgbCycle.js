// ---------------------------------------------------------------------------
// RGB CYCLE
// One shared "colour clock" so everything RGB in the room (PC fans and strips,
// speaker rings, and the coloured light they throw on the walls) changes
// colour together, like real synced RGB software.
// ---------------------------------------------------------------------------

// Seconds for one full trip around the colour wheel. Lower = faster cycling.
export const RGB_CYCLE_SECONDS = 24

// Returns a hue from 0 to 1 for the given scene time. `offset` shifts it round
// the wheel (0.5 = the opposite colour), handy for a second light.
export function rgbHue(elapsedSeconds, offset = 0) {
  return (elapsedSeconds / RGB_CYCLE_SECONDS + offset) % 1
}
