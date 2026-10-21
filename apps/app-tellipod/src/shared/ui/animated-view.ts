import type { ComponentType } from 'react'
import type { ViewProps } from 'react-native'
import Animated, { type AnimatedProps } from 'react-native-reanimated'

export const AnimatedView = Animated.View as ComponentType<AnimatedProps<ViewProps>>
