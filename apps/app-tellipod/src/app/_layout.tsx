import '@/shared/i18n'

import {
  PublicSans_400Regular,
  PublicSans_500Medium,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
} from '@expo-google-fonts/public-sans'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { Easing, LinearTransition, ReduceMotion } from 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { AnimatedView, motion } from '@/shared/ui'
import { AppHeader } from '@/widgets/app-header'
import { registerDevTools } from '@/widgets/dev-tools'

import { onboardedAtom } from '@/features/onboarding'

const bodyLayout = LinearTransition.duration(motion.headerDuration)
  .easing(Easing.out(Easing.quad))
  .reduceMotion(ReduceMotion.System)

registerDevTools()
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const onboarded = useAtomValue(onboardedAtom)
  const [fontsLoaded, fontError] = useFonts({
    PublicSans_400Regular,
    PublicSans_500Medium,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
  })
  const ready = fontsLoaded || fontError !== null

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync()
    }
  }, [ready])

  if (!ready) {
    return null
  }

  return (
    <SafeAreaProvider>
      <AppHeader />
      <AnimatedView layout={bodyLayout} style={styles.body}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!onboarded}>
            <Stack.Screen name="onboarding" />
          </Stack.Protected>
          <Stack.Protected guard={onboarded}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="pods/[id]" />
          </Stack.Protected>
        </Stack>
      </AnimatedView>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  body: { flex: 1 },
})
