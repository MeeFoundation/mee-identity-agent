// The prototype's world geometry in isometric units (`u`, `v` on the floor, `z` up); see `iso` in engine/math.

export const C = {
  b50: '#f3f8f8',
  b100: '#dfecee',
  b200: '#c3dcde',
  b300: '#9ac2c6',
  b400: '#69a0a7',
  b500: '#4f868e',
  b600: '#436e77',
  b700: '#3b5b63',
  b950: '#1d2a2f',
  g50: '#f8fafc',
  g100: '#f1f5f9',
  g200: '#e2e8f0',
  g300: '#cbd5e1',
  g800: '#1e293b',
  g900: '#0f172a',
  g950: '#020617',
  o50: '#fef7ee',
  o100: '#feecd6',
  o200: '#fcdcbb',
  o400: '#f58e42',
  o500: '#f26e1d',
  o600: '#e35413',
  p100: '#fbecfa',
  p200: '#f6d8f4',
  p400: '#e290d8',
  p600: '#bc52ad',
  p700: '#943785',
  p800: '#7a2e6d',
  p950: '#411138',
  w100: '#fcf0c9',
  w200: '#f9df89',
  w600: '#d2710d',
  white: '#ffffff',
} as const

export const DOOR = {
  doorway: {
    u0: 42,
    u1: 58,
    v: -61.8,
    z1: 30,
  },
  frame: {
    u0: 40.5,
    u1: 59.5,
    v: -61.9,
    z1: 31.5,
  },
  height: 30,
  hingeU: 42,
  knob: [45, -61.4, 15],
  maxDeg: 70,
  width: 16,
} as const

export const LINE = {
  ctrlDx: -6,
  ctrlDy: -46,
  dash: [0.01, 8],
  p0: [50, -62, 30],
  p2: [-31, -31, 14],
  pulseR: 3,
  width: 3.2,
} as const

export const CAT_SIT_ANCHOR = [44, -42, 0] as const

export const CAT_CURL_ANCHOR = [54, -22, 3] as const

export const ASM = {
  empty: [450, 650],
  ginger: [350, 550],
  halo: [900, 1000, 1100],
  kyoto: [250, 450],
  phone: [0, 300],
  shell: [0, 300],
  sofia: [150, 350],
} as const

export const HALO_PEAK = 0.35 as const
