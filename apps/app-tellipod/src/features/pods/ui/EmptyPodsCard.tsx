import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { colors, CookieIcon, PlusIcon, radii, sizes, spacing, typography } from '@/shared/ui'

type EmptyPodsCardProps = {
  readonly onAddPod?: () => void
  readonly onDismiss: () => void
  readonly testID?: string
}

const ICON_HOLDER_PADDING = spacing[4]
const BUTTON_LABEL_PADDING = spacing[2.5]
const BUTTON_BORDER = 1
const HIGHLIGHT_HEIGHT = 2
const BRAND_GRADIENT_START = { x: 0, y: 0.3 }
const BRAND_GRADIENT_END = { x: 1, y: 0.7 }
const SHEEN_COLORS = [colors.alphaWhite15, '#ffffff00'] as const
const BRAND_COLORS = [colors.auxiliaryBrand700, colors.auxiliaryBrand500] as const

export const EmptyPodsCard = ({ onAddPod, onDismiss, testID }: EmptyPodsCardProps) => {
  const { t } = useTranslation()
  const childTestID = (suffix: string) => (testID ? `${testID}-${suffix}` : undefined)

  return (
    <View style={styles.card} testID={testID}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.iconHolder}
        testID={childTestID('icon')}
      >
        <CookieIcon />
      </View>
      <View style={styles.text}>
        <Text accessibilityRole="header" style={styles.title}>
          {t('pod.section.emptyTitle')}
        </Text>
        <Text style={styles.body}>{t('pod.section.emptyBody')}</Text>
      </View>
      <View style={styles.actions}>
        {onAddPod ? (
          <Pressable
            accessibilityRole="button"
            onPress={onAddPod}
            style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
            testID={childTestID('add')}
          >
            <LinearGradient
              colors={BRAND_COLORS}
              end={BRAND_GRADIENT_END}
              start={BRAND_GRADIENT_START}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient colors={SHEEN_COLORS} style={StyleSheet.absoluteFill} />
            <View pointerEvents="none" style={styles.highlight} />
            <PlusIcon />
            <Text style={styles.primaryLabel}>{t('pod.section.addPod')}</Text>
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={onDismiss}
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
          testID={childTestID('dismiss')}
        >
          <Text style={styles.secondaryLabel}>{t('pod.section.maybeLater')}</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  actions: { alignSelf: 'stretch', gap: spacing[2] },
  body: { ...typography.smRegular, color: colors.textDefaultBody },
  card: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceDefaultMain,
    borderRadius: radii['2xl'],
    boxShadow: `0px 0px 0px 1px ${colors.alphaDark5}, 0px 1px 20px 1px ${colors.alphaDark5}`,
    gap: spacing[4],
    padding: spacing[4],
  },
  highlight: {
    backgroundColor: colors.alphaWhite25,
    height: HIGHLIGHT_HEIGHT,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  iconHolder: {
    alignItems: 'center',
    backgroundColor: colors.surfaceBrandSoft,
    borderRadius: radii.full,
    padding: ICON_HOLDER_PADDING,
  },
  pressed: { opacity: 0.8 },
  primary: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: colors.strokeBrandSolidHover,
    borderRadius: radii.xl,
    borderWidth: BUTTON_BORDER,
    flexDirection: 'row',
    height: sizes.field,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  primaryLabel: {
    ...typography.baseSemibold,
    color: colors.surfaceDefaultMain,
    paddingHorizontal: BUTTON_LABEL_PADDING,
  },
  secondary: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: radii.xl,
    height: sizes.field,
    justifyContent: 'center',
  },
  secondaryLabel: { ...typography.baseSemibold, color: colors.textBrandSolid, paddingHorizontal: BUTTON_LABEL_PADDING },
  text: { alignSelf: 'stretch', gap: spacing[1] },
  title: { ...typography['2xlSemibold'], color: colors.textDefaultTitle },
})
