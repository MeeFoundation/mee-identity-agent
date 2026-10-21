const FACE_IDS = [
  'you',
  'walker',
  'partner',
  'sister',
  'friendA',
  'friendB',
  'contractor',
  'readerA',
  'readerB',
] as const

export type FaceId = (typeof FACE_IDS)[number]

export const FACES: Record<FaceId, { cut: 'short' | 'curls' | 'long' | 'bun'; hair: string; skin: string }> = {
  contractor: { cut: 'short', hair: '#7A746E', skin: '#C99A76' },
  friendA: { cut: 'short', hair: '#1F1B18', skin: '#8E5E42' },
  friendB: { cut: 'bun', hair: '#2B2320', skin: '#EBC3A5' },
  partner: { cut: 'long', hair: '#B8813C', skin: '#F3D7C2' },
  readerA: { cut: 'curls', hair: '#4A3222', skin: '#F0CBB0' },
  readerB: { cut: 'bun', hair: '#1F1B18', skin: '#9C6B4E' },
  sister: { cut: 'long', hair: '#5C3A22', skin: '#D9A882' },
  walker: { cut: 'curls', hair: '#1F1B18', skin: '#B98563' },
  you: { cut: 'short', hair: '#3B2A20', skin: '#E9BFA0' },
}
