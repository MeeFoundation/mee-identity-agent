export const colors = {
  alphaDark5: '#0206170d',
  alphaDark7: '#02061712',
  alphaDark10: '#0206171a',
  alphaDark15: '#02061726',
  strokeDefaultMain: '#ffffff',
  strokeGrayAccent: '#cbd5e1',
  surfaceBrandLight: '#dfecee',
  surfaceBrandSolid: '#3b5b63',
  surfaceDefaultMain: '#ffffff',
  surfaceGrayLight: '#f1f5f9',
  textBrandSolid: '#3b5b63',
  textDefaultPlaceholder: '#64748b',
  textDefaultSubtle: '#475569',
  textDefaultTitle: '#0f172a',
  textGrayOnSoftBackground: '#0f172a',
} as const

export const spacing = {
  0.5: 2,
  1: 4,
  2: 8,
  2.5: 10,
  3: 12,
  5: 20,
  px: 1,
} as const

export const radii = {
  '2lg': 10,
  '3xl': 28,
  full: 9999,
  xl: 12,
} as const

export const sizes = {
  avatar: 48,
  field: 44,
  iconButton: 44,
  tab: 36,
} as const

export const fontFamilies = {
  bold: 'PublicSans_700Bold',
  medium: 'PublicSans_500Medium',
  regular: 'PublicSans_400Regular',
  semibold: 'PublicSans_600SemiBold',
} as const

export const typography = {
  baseMedium: { fontFamily: fontFamilies.medium, fontSize: 16, letterSpacing: 0.08, lineHeight: 24 },
  baseRegular: { fontFamily: fontFamilies.regular, fontSize: 16, letterSpacing: 0.08, lineHeight: 24 },
  baseSemibold: { fontFamily: fontFamilies.semibold, fontSize: 16, letterSpacing: 0.08, lineHeight: 24 },
  lgBold: { fontFamily: fontFamilies.bold, fontSize: 18, letterSpacing: 0.09, lineHeight: 28 },
  xlSemibold: { fontFamily: fontFamilies.semibold, fontSize: 20, letterSpacing: 0.1, lineHeight: 30 },
  xsRegular: { fontFamily: fontFamilies.regular, fontSize: 12, letterSpacing: 0.06, lineHeight: 16 },
} as const

export const motion = {
  headerDuration: 200,
} as const
