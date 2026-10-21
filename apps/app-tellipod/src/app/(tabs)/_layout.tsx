import { type BottomTabBarProps, Tabs } from 'expo-router/js-tabs'

import { AppFooter } from '@/widgets/app-footer'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props: BottomTabBarProps) => <AppFooter {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="ask-telli" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="navigation" />
    </Tabs>
  )
}
