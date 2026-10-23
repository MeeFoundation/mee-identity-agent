import type { BottomTabBarProps } from 'expo-router/js-tabs'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { chromeAtom, unreadNotificationsAtom } from '@/shared/chrome'
import {
  BellFilledIcon,
  BellIcon,
  colors,
  HomeFilledIcon,
  HomeIcon,
  ListNestedIcon,
  radii,
  spacing,
  TelliGuideIcon,
} from '@/shared/ui'

import { FooterTab, type FooterTabIcons } from './footer-tab'

const tabIcons: Record<string, FooterTabIcons> = {
  'ask-telli': { filled: TelliGuideIcon, outline: TelliGuideIcon },
  index: { filled: HomeFilledIcon, outline: HomeIcon },
  navigation: { filled: ListNestedIcon, outline: ListNestedIcon },
  notifications: { filled: BellFilledIcon, outline: BellIcon },
}

export const AppFooter = ({ state, emitter, navigateToTab }: BottomTabBarProps) => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { footer } = useAtomValue(chromeAtom)
  const unread = useAtomValue(unreadNotificationsAtom)

  if (footer === 'hidden') {
    return null
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing[2]) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index
        const icons = tabIcons[route.name]
        const onPress = () => {
          const event = emitter.emit({ canPreventDefault: true, target: route.key, type: 'tabPress' })
          if (!focused && !event.defaultPrevented) {
            navigateToTab(route.key)
          }
        }

        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            key={route.key}
            onPress={onPress}
            style={styles.tab}
          >
            {icons && (
              <FooterTab
                focused={focused}
                icons={icons}
                label={t(`footer.${route.name}`)}
                showBadge={route.name === 'notifications' && unread > 0}
                unreadLabel={t('footer.unreadIndicator')}
              />
            )}
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.alphaWhite80,
    borderColor: colors.strokeDefaultMain,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: radii['3xl'],
    borderTopRightRadius: radii['3xl'],
    borderTopWidth: 1,
    elevation: 8,
    flexDirection: 'row',
    paddingHorizontal: spacing[2],
    shadowColor: colors.alphaDark10,
    shadowOffset: { height: -1, width: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  tab: { flex: 1 },
})
