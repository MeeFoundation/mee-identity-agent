import type { BottomTabBarProps } from 'expo-router/js-tabs'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { chromeAtom, unreadNotificationsAtom } from '@/shared/chrome'

export const AppFooter = ({ state, emitter, navigateToTab }: BottomTabBarProps) => {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const { footer } = useAtomValue(chromeAtom)
  const unread = useAtomValue(unreadNotificationsAtom)

  if (footer === 'hidden') {
    return null
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index
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
            <View>
              <Text style={focused ? styles.active : styles.inactive}>{t(`footer.${route.name}`)}</Text>
              {route.name === 'notifications' && unread > 0 && (
                <View accessibilityLabel={t('footer.unreadIndicator')} style={styles.dot} />
              )}
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  active: { color: '#2f5d68', fontSize: 12, fontWeight: '600' },
  container: { backgroundColor: '#ffffff', flexDirection: 'row', paddingTop: 8 },
  dot: { backgroundColor: '#c8102e', borderRadius: 4, height: 8, position: 'absolute', right: -6, top: -4, width: 8 },
  inactive: { color: '#6b7280', fontSize: 12 },
  tab: { alignItems: 'center', flex: 1, paddingVertical: 8 },
})
