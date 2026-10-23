import { Children, type FC, type ReactNode } from 'react'
import { Pressable, type StyleProp, StyleSheet, Text, View, type ViewStyle } from 'react-native'

export type PanelFooter = {
  label: string
  icon?: ReactNode
  variant: 'outline' | 'ghost'
  onPress: () => void
}

const colors = {
  alphaDark5: 'rgba(2, 6, 23, 0.05)',
  strokeGrayAccent: '#CBD5E1',
  surfaceDefaultMain: '#FFFFFF',
  textGraySolid: '#334155',
}

const DIVIDER_WIDTH = 1

const styles = StyleSheet.create({
  clipDivider: {
    marginBottom: -DIVIDER_WIDTH,
  },
  dividerCover: {
    backgroundColor: colors.surfaceDefaultMain,
    height: DIVIDER_WIDTH,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  footerButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 12,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingVertical: 10,
  },
  footerGhost: {
    paddingHorizontal: 6,
  },
  footerGhostContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  footerLabel: {
    color: colors.textGraySolid,
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 16,
    letterSpacing: 0.08,
    lineHeight: 24,
  },
  footerLabelBox: {
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  footerOutline: {
    borderColor: colors.strokeGrayAccent,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  footerOutlineContainer: {
    paddingBottom: 8,
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  surface: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceDefaultMain,
    borderRadius: 16,
    boxShadow: `0px 0px 0px 1px ${colors.alphaDark5}, 0px 1px 20px 1px ${colors.alphaDark5}`,
    overflow: 'hidden',
  },
})

export const clipDividerStyle = styles.clipDivider

export const hasContent = (children: ReactNode): boolean => Children.toArray(children).length > 0

export const PanelSurface: FC<{ children: ReactNode; style?: StyleProp<ViewStyle>; testID?: string }> = ({
  children,
  style,
  testID,
}) => (
  <View style={[styles.surface, style]} testID={testID}>
    {children}
  </View>
)

export const PanelBody: FC<{ children: ReactNode; gap?: number; testID?: string }> = ({ children, gap, testID }) => {
  if (!hasContent(children)) return null

  return (
    <View style={[styles.clipDivider, gap ? { gap } : null]} testID={testID}>
      {children}
    </View>
  )
}

export const PanelFooterAction: FC<{ footer: PanelFooter; testID?: string }> = ({ footer, testID }) => {
  const isOutline = footer.variant === 'outline'

  return (
    <View style={isOutline ? styles.footerOutlineContainer : styles.footerGhostContainer} testID={testID}>
      <View pointerEvents="none" style={styles.dividerCover} testID={testID ? `${testID}-cover` : undefined} />
      <Pressable
        accessibilityLabel={footer.label}
        accessibilityRole="button"
        onPress={footer.onPress}
        style={[styles.footerButton, isOutline ? styles.footerOutline : styles.footerGhost]}
      >
        {footer.icon}
        <View style={styles.footerLabelBox}>
          <Text style={styles.footerLabel}>{footer.label}</Text>
        </View>
      </Pressable>
    </View>
  )
}
