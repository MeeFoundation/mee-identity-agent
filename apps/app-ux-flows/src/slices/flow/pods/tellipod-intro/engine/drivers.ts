import { eio, eo, interp, lerp, ph, remap, smooth } from './math'
import { STORY_SPAN, T2 } from './timeline'

// `p` is the controller's progress; beat 2's story is stretched into the move from 1 towards 2, so `q` (the camera's
// beat position) stays at 1 until the story has played from where the reviewer left it (`t2From`).
export const storyEndOf = (t2From: number) => 1 + STORY_SPAN * (1 - t2From)

export const qOf = (p: number, storyEnd: number) => {
  if (p <= 1) return p
  if (p < storyEnd) return 1
  if (p <= 2) return 1 + (p - storyEnd) / (2 - storyEnd)
  return p
}

// Beat 2's story position: the reviewer's own progress, or the auto-played remainder while moving on.
export const V2of = (p: number, t2: number, t2From: number, storyEnd: number) => {
  if (p <= 1) return t2
  const drawn = storyEnd - 1 < 1e-6 ? 1 : remap(p, 1, storyEnd)
  return Math.max(t2, t2From + (1 - t2From) * drawn)
}

export const V3of = (q: number, t3: number) =>
  q <= 2 ? Math.min(t3, remap(q, 1.6, 2)) : Math.max(t3, remap(q, 2, 2.35))

export const A1of = (q: number, s1: number) => Math.max(s1, remap(q, 0, 0.25))

// Vertical offset of Paula's phone in the world.
export const dvOf = (q: number) =>
  q <= 2 ? lerp(-440, -230, eo(remap(q, 1.5, 2))) : lerp(-230, -440, eio(remap(q, 2, 2.5)))

// How bright the rooms other than Ginger's are.
export const dimOf = (q: number) => interp(q, [0, 0.3, 1, 2.2, 2.6, 3], [1, 1, 0.5, 0.5, 1, 1])

// Where the cat looks.
export const gazeOf = (q: number, v2: number) => {
  const m2 = v2 * T2
  const gStory = 0.6 - 1.2 * eio(ph(m2, 1300, 2000))
  return q <= 1 ? remap(q, 0.8, 1) * gStory : lerp(gStory, 0.8, remap(q, 1.6, 2))
}

// How far the Ginger tag has docked into the card's header.
export const dockWOf = (q: number) => (q <= 1 ? smooth(remap(q, 0.55, 0.9)) : 1 - smooth(remap(q, 1.05, 1.45)))

// How far the note card has grown out of the desk paper.
export const cardWOf = (q: number) => (q <= 1 ? smooth(remap(q, 0.55, 0.95)) : 1 - smooth(remap(q, 1, 1.35)))
