import { useRouter } from 'expo-router'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

import { PodTabs } from './pod-tabs'
import type { PodHeaderConfig } from '@/shared/chrome'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  colors,
  PeopleIcon,
  radii,
  sizes,
  spacing,
  ThreeDotsVerticalIcon,
  typography,
} from '@/shared/ui'

type PodHeaderProps = {
  pod: PodHeaderConfig
}

export const PodHeader = ({ pod }: PodHeaderProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <>
      <View style={styles.row}>
        <Pressable
          accessibilityLabel={t('header.back')}
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <ChevronLeftIcon />
        </Pressable>
        <View style={styles.identity}>
          {pod.avatarUri ? (
            <Image accessibilityIgnoresInvertColors source={{ uri: pod.avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarInitial}>{pod.title.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={styles.text}>
            <Text numberOfLines={1} style={styles.title}>
              {pod.title}
            </Text>
            <View style={styles.breadcrumb}>
              {pod.breadcrumb.map((item, index) => (
                <Fragment key={item.label}>
                  {index > 0 && <ChevronRightIcon />}
                  {item.icon === 'people' && <PeopleIcon />}
                  <Text numberOfLines={1} style={styles.breadcrumbLabel}>
                    {item.label}
                  </Text>
                </Fragment>
              ))}
            </View>
          </View>
        </View>
        <Pressable accessibilityLabel={t('header.menu')} accessibilityRole="button" style={styles.iconButton}>
          <ThreeDotsVerticalIcon />
        </Pressable>
      </View>
      <PodTabs onChange={pod.onTabChange} selected={pod.tab} />
    </>
  )
}

const styles = StyleSheet.create({
  avatar: { borderRadius: radii.full, height: sizes.avatar, width: sizes.avatar },
  avatarFallback: { alignItems: 'center', backgroundColor: colors.surfaceBrandLight, justifyContent: 'center' },
  avatarInitial: { ...typography.baseSemibold, color: colors.textBrandSolid },
  breadcrumb: { alignItems: 'center', flexDirection: 'row', gap: spacing[1], height: 16 },
  breadcrumbLabel: { ...typography.xsRegular, color: colors.textBrandSolid, flexShrink: 1 },
  iconButton: {
    alignItems: 'center',
    borderRadius: radii.xl,
    height: sizes.iconButton,
    justifyContent: 'center',
    width: sizes.iconButton,
  },
  identity: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: spacing[3], minWidth: 0 },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing[2] },
  text: { flex: 1, gap: spacing[0.5], minWidth: 0 },
  title: { ...typography.baseMedium, color: colors.textDefaultTitle },
})
