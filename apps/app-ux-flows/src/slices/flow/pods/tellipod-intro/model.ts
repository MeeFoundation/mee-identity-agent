export type IntroScreenId =
  | 'rooms'
  | 'ginger-pod'
  | 'paula'
  | 'welcome'
  | 'telli-handoff'
  | 'existing-device'
  | 'restore'

export type BeatId = Extract<IntroScreenId, 'rooms' | 'ginger-pod' | 'paula' | 'welcome'>

// The beats in order; a beat's index is its position in the scene's progress.
export const BEATS: readonly BeatId[] = ['rooms', 'ginger-pod', 'paula', 'welcome']

// `next` moves on with a Next button (v1 · Rooms); `tap` moves on by tapping controls in the scene (v1.2 · Tap through);
// `living` keeps the Next button but draws the flat living-pod scene instead of the isometric home (v2 · Living pod).
export type IntroMode = 'next' | 'tap' | 'living'
