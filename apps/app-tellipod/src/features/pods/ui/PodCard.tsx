import { Avatar, Breadcrumbs, ChevronRightIcon } from '@mee/ui'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import type { PodSummary } from '../model/pod-summary'
import { getCategoryIcon, getCategoryLabel } from './category-presentation'
import { colors, radii, spacing, typography } from '@/shared/ui'

type PodCardProps = {
  readonly pod: PodSummary
  readonly onPress: (pod: PodSummary) => void
  readonly testID?: string
}

const UNREAD_DOT_SIZE = 12
const UNREAD_DOT_BORDER = 2

export const PodCard = ({ pod, onPress, testID }: PodCardProps) => {
  const { t } = useTranslation()

  const categoryLabel = getCategoryLabel(t, pod.category.id)
  const subcategoryLabel = pod.subcategory ? getCategoryLabel(t, pod.subcategory.id) : null
  const crumbs = [
    { icon: getCategoryIcon(pod.category.id), label: categoryLabel },
    ...(subcategoryLabel ? [{ label: subcategoryLabel }] : []),
  ]
  const accessibilityLabel = [
    pod.name,
    ...crumbs.map((crumb) => crumb.label),
    ...(pod.hasUnread ? [t('pod.card.unread')] : []),
  ].join(', ')

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={() => onPress(pod)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      testID={testID}
    >
      {pod.avatarUrl ? (
        <Avatar size="l" source={{ uri: pod.avatarUrl }} testID={testID ? `${testID}-avatar` : undefined} />
      ) : (
        <Avatar
          initials={Array.from(pod.name)[0]?.toUpperCase() ?? ''}
          size="m"
          testID={testID ? `${testID}-avatar` : undefined}
          tone="gray"
        />
      )}
      <View style={styles.text}>
        <Text numberOfLines={1} style={styles.name}>
          {pod.name}
        </Text>
        <Breadcrumbs items={crumbs} />
      </View>
      <ChevronRightIcon />
      {pod.hasUnread ? <View style={styles.unreadDot} testID={testID ? `${testID}-unread` : undefined} /> : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  name: { ...typography.baseMedium, color: colors.textDefaultTitle },
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
  rowPressed: { backgroundColor: colors.surfaceGrayLight },
  text: { flex: 1, minWidth: 0 },
  unreadDot: {
    backgroundColor: colors.surfaceErrorSolid,
    borderColor: colors.strokeDefaultMain,
    borderRadius: radii.full,
    borderWidth: UNREAD_DOT_BORDER,
    height: UNREAD_DOT_SIZE,
    left: spacing[2.5],
    position: 'absolute',
    top: spacing[2.5],
    width: UNREAD_DOT_SIZE,
  },
})
