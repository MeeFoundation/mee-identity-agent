import type { FC } from 'react'
import { Image, type ImageSourcePropType, StyleSheet, Text, View, type ViewStyle } from 'react-native'

export type AvatarSize = 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs'
export type AvatarShape = 'circle' | 'rounded'
export type AvatarTone = 'brand' | 'gray'

type AvatarBaseProps = {
  readonly size?: AvatarSize
  readonly shape?: AvatarShape
  readonly accessibilityLabel?: string
  readonly style?: ViewStyle
  readonly testID?: string
}

type AvatarImageProps = { readonly source: ImageSourcePropType; readonly initials?: never; readonly tone?: never }
type AvatarInitialsProps = { readonly initials: string; readonly tone?: AvatarTone; readonly source?: never }

export type AvatarProps = AvatarBaseProps & (AvatarImageProps | AvatarInitialsProps)

type SizeSpec = {
  readonly dimension: number
  readonly fontSize: number
  readonly letterSpacing: number
  readonly lineHeight: number
  readonly radius: number
}

const sizes: Record<AvatarSize, SizeSpec> = {
  l: { dimension: 48, fontSize: 18, letterSpacing: 0.09, lineHeight: 28, radius: 8 },
  m: { dimension: 40, fontSize: 16, letterSpacing: 0.08, lineHeight: 24, radius: 8 },
  s: { dimension: 32, fontSize: 14, letterSpacing: 0.07, lineHeight: 20, radius: 4 },
  xl: { dimension: 64, fontSize: 20, letterSpacing: 0.1, lineHeight: 30, radius: 8 },
  xs: { dimension: 24, fontSize: 12, letterSpacing: 0.06, lineHeight: 16, radius: 2 },
  xxs: { dimension: 16, fontSize: 12, letterSpacing: 0.06, lineHeight: 16, radius: 2 },
}

const tones: Record<AvatarTone, { backgroundColor: string; color: string }> = {
  brand: { backgroundColor: '#DFECEE', color: '#4F868E' },
  gray: { backgroundColor: '#F1F5F9', color: '#64748B' },
}

const fullRadius = 9999

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  initials: {
    fontFamily: 'PublicSans_700Bold',
  },
})

export const Avatar: FC<AvatarProps> = ({
  size = 'm',
  shape = 'circle',
  accessibilityLabel,
  style,
  testID,
  ...content
}) => {
  const spec = sizes[size]
  const frameStyle: ViewStyle = {
    borderRadius: shape === 'circle' ? fullRadius : spec.radius,
    height: spec.dimension,
    width: spec.dimension,
  }
  const tone = tones[content.tone ?? 'brand']
  const labelled = Boolean(accessibilityLabel)

  return (
    <View
      accessibilityElementsHidden={!labelled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={labelled && content.source !== undefined ? 'image' : undefined}
      accessible={labelled}
      importantForAccessibility={labelled ? 'auto' : 'no-hide-descendants'}
      style={[
        styles.frame,
        frameStyle,
        content.source === undefined ? { backgroundColor: tone.backgroundColor } : null,
        style,
      ]}
      testID={testID}
    >
      {content.source !== undefined ? (
        <Image
          accessibilityIgnoresInvertColors
          source={content.source}
          style={styles.image}
          testID={testID ? `${testID}-image` : undefined}
        />
      ) : (
        <Text
          numberOfLines={1}
          style={[
            styles.initials,
            {
              color: tone.color,
              fontSize: spec.fontSize,
              letterSpacing: spec.letterSpacing,
              lineHeight: spec.lineHeight,
            },
          ]}
        >
          {content.initials}
        </Text>
      )}
    </View>
  )
}
