export const colors = {
  alphaDark5: '#0206170d',
  alphaDark7: '#02061712',
  alphaDark10: '#0206171a',
  alphaDark15: '#02061726',
  alphaWhite15: '#ffffff26',
  alphaWhite25: '#ffffff40',
  alphaWhite80: '#ffffffcc',
  auxiliaryBrand500: '#4f868e',
  auxiliaryBrand700: '#3b5b63',
  strokeBrandSolidHover: '#374e53',
  strokeDefaultMain: '#ffffff',
  strokeGrayAccent: '#cbd5e1',
  surfaceBrandLight: '#dfecee',
  surfaceBrandSoft: '#f3f8f8',
  surfaceBrandSolid: '#3b5b63',
  surfaceDefaultMain: '#ffffff',
  surfaceErrorSolid: '#b91c1c',
  surfaceGrayLight: '#f1f5f9',
  textBrandMain: '#4f868e',
  textBrandSolid: '#3b5b63',
  textDefaultBody: '#1e293b',
  textDefaultPlaceholder: '#64748b',
  textDefaultSubtle: '#475569',
  textDefaultTitle: '#0f172a',
  textGrayOnSoftBackground: '#0f172a',
  textGraySolid: '#334155',
} as const

export const spacing = {
  0.5: 2,
  1: 4,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  px: 1,
} as const

export const radii = {
  '2lg': 10,
  '2xl': 16,
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
  '2xlSemibold': { fontFamily: fontFamilies.semibold, fontSize: 24, letterSpacing: 0.12, lineHeight: 32 },
  lgBold: { fontFamily: fontFamilies.bold, fontSize: 18, letterSpacing: 0.09, lineHeight: 28 },
  smRegular: { fontFamily: fontFamilies.regular, fontSize: 14, letterSpacing: 0.07, lineHeight: 20 },
  xlSemibold: { fontFamily: fontFamilies.semibold, fontSize: 20, letterSpacing: 0.1, lineHeight: 30 },
  xsRegular: { fontFamily: fontFamilies.regular, fontSize: 12, letterSpacing: 0.06, lineHeight: 16 },
  xsSemibold: { fontFamily: fontFamilies.semibold, fontSize: 12, letterSpacing: 0.06, lineHeight: 16 },
  xxsMedium: { fontFamily: fontFamilies.medium, fontSize: 10, letterSpacing: 0.05, lineHeight: 14 },
} as const

export const motion = {
  footerDuration: 250,
  headerDuration: 200,
  skeletonPulseDuration: 800,
} as const
