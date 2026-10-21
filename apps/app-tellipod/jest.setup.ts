import '@/shared/i18n'

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default)

jest.mock('expo-router', () => {
  const { useEffect } = require('react')
  return {
    useFocusEffect: (effect: () => undefined | (() => void)) => useEffect(effect, [effect]),
    useRouter: jest.fn(() => ({ back: jest.fn() })),
  }
})

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native')
  return { LinearGradient: View }
})

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native')
  const animation = (): object => {
    const builder: object = new Proxy(() => builder, { get: () => () => builder })
    return builder
  }
  return {
    __esModule: true,
    default: { View },
    Easing: { out: () => undefined, quad: undefined },
    FadeIn: animation(),
    FadeOut: animation(),
    LinearTransition: animation(),
    ReduceMotion: { System: 'system' },
  }
})
