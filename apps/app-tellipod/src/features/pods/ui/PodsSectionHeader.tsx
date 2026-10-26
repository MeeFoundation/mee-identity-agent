import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { ArrowRightIcon, colors, spacing, typography } from '@/shared/ui'

type PodsSectionHeaderProps = {
  readonly onSeeAll?: () => void
  readonly testID?: string
}

const LABEL_LINK_GAP = 10

export const PodsSectionHeader = ({ onSeeAll, testID }: PodsSectionHeaderProps) => {
  const { t } = useTranslation()

  return (
    <View style={styles.row} testID={testID}>
      <Text accessibilityRole="header" style={styles.label}>
        {t('pod.section.recent')}
      </Text>
      {onSeeAll ? (
        <Pressable
          accessibilityRole="button"
          onPress={onSeeAll}
          style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
          testID={testID ? `${testID}-see-all` : undefined}
        >
          <Text style={styles.linkText}>{t('pod.section.seeAll')}</Text>
          <ArrowRightIcon />
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  label: { ...typography.xsSemibold, color: colors.textDefaultSubtle, flex: 1, textTransform: 'uppercase' },
  link: { alignItems: 'center', flexDirection: 'row', gap: spacing[2] },
  linkPressed: { opacity: 0.6 },
  linkText: { ...typography.smRegular, color: colors.textBrandSolid },
  row: { alignItems: 'center', alignSelf: 'stretch', flexDirection: 'row', gap: LABEL_LINK_GAP },
})
