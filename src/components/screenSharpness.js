// ---------------------------------------------------------------------------
// SCREEN TEXT SHARPNESS
// The monitor screens are real HTML laid out at a small size and then scaled
// up onto the 3D monitors. Browsers draw the text at that small size first, so
// scaling it up makes it blurry (like zooming into a screenshot).
//
// The fix: lay the HTML out SCREEN_TEXT_ZOOM times bigger (CSS `zoom`) and
// shrink it back down by the same amount in 3D. It ends up exactly the same
// size on the monitor, but the browser draws it with that many times more
// detail. The layout and CSS sizes don't change.
//
// 3 = crisp at 1080p and 1440p. Higher costs more graphics memory for little
// visible gain; 1 = the old blurry behaviour.
// ---------------------------------------------------------------------------
export const SCREEN_TEXT_ZOOM = 3
