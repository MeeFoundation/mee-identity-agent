import { StyleSheet, View } from 'react-native'

import { colors, radii, spacing } from '@/shared/ui'

type PodCardSkeletonProps = {
  readonly testID?: string
}

const AVATAR_SIZE = 40
const NAME_BAR_HEIGHT = 16
const CRUMB_BAR_HEIGHT = 12

export const PodCardSkeleton = ({ testID }: PodCardSkeletonProps) => (
  <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.row} testID={testID}>
    <View style={styles.avatar} />
    <View style={styles.text}>
      <View style={styles.nameBar} />
      <View style={styles.crumbBar} />
    </View>
  </View>
)

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.surfaceGrayLight,
    borderRadius: radii.full,
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
  },
  crumbBar: {
    backgroundColor: colors.surfaceGrayLight,
    borderRadius: radii.full,
    height: CRUMB_BAR_HEIGHT,
    width: '35%',
  },
  nameBar: {
    backgroundColor: colors.surfaceGrayLight,
    borderRadius: radii.full,
    height: NAME_BAR_HEIGHT,
    width: '55%',
  },
  row: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceDefaultMain,
    borderRadius: radii['2xl'],
    boxShadow: `0px 0px 0px 1px ${colors.alphaDark5}, 0px 1px 20px 1px ${colors.alphaDark5}`,
    flexDirection: 'row',
    gap: spacing[2.5],
    paddingLeft: spacing[2.5],
    paddingRight: spacing[4],
    paddingVertical: spacing[2.5],
  },
  text: { flex: 1, gap: spacing[1], minWidth: 0 },
})
