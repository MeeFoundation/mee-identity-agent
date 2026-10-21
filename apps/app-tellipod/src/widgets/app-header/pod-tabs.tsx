import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import type { PodTab } from '@/shared/chrome'
import { colors, radii, sizes, spacing, typography } from '@/shared/ui'

const TABS: PodTab[] = ['notes', 'chat', 'info']

type PodTabsProps = {
  selected: PodTab
  onChange: (tab: PodTab) => void
}

export const PodTabs = ({ selected, onChange }: PodTabsProps) => {
  const { t } = useTranslation()

  return (
    <View accessibilityRole="tablist" style={styles.container}>
      {TABS.map((tab) => {
        const isSelected = tab === selected
        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            key={tab}
            onPress={() => {
              if (!isSelected) {
                onChange(tab)
              }
            }}
            style={[styles.tab, isSelected && styles.tabSelected]}
          >
            <Text style={styles.label}>{t(`pod.tabs.${tab}`)}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.alphaDark5,
    borderColor: colors.alphaDark10,
    borderRadius: radii.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.px,
    padding: spacing[1],
  },
  label: { ...typography.baseSemibold, color: colors.textGrayOnSoftBackground, textAlign: 'center' },
  tab: {
    alignItems: 'center',
    borderRadius: radii['2lg'],
    flex: 1,
    height: sizes.tab,
    justifyContent: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  tabSelected: { backgroundColor: colors.surfaceDefaultMain },
})
