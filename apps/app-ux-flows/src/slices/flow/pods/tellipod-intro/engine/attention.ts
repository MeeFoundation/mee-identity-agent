// Port of the prototype's attention module: the ring and ripple that mark the control to tap next in tap mode.

// One ripple every period; it spreads over the first part of it and rests for the rest.
export const HL_PERIOD_MS = 1500
export const HL_RIPPLE_MS = 1100
// Where the loop is held under reduced motion.
export const HL_FROZEN = 0.25333333333333335
export const HL_GAP = 2
export const HL_STROKE = 2
export const HL_SPREAD = 8
export const HL_CLEAR = 4

// Progress 0..1 of the ripple at loop position `hl` (whole turns of the period), or -1 when there is none.
export const ripple = (hl: number, reducedMotion: boolean) => {
  if (reducedMotion) return -1
  const t = (hl - Math.floor(hl)) * HL_PERIOD_MS
  return t >= HL_RIPPLE_MS ? -1 : t / HL_RIPPLE_MS
}
