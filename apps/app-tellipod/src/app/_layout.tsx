import '@/shared/i18n'

import {
  PublicSans_400Regular,
  PublicSans_500Medium,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
} from '@expo-google-fonts/public-sans'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Easing, LinearTransition, ReduceMotion } from 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { onboardedAtom } from '@/features/onboarding'
import { AnimatedView, motion } from '@/shared/ui'
import { AppHeader } from '@/widgets/app-header'
import { registerDevTools } from '@/widgets/dev-tools'

const bodyLayout = LinearTransition.duration(motion.headerDuration)
  .easing(Easing.out(Easing.quad))
  .reduceMotion(ReduceMotion.System)

registerDevTools()
SplashScreen.preventAutoHideAsync()

function AppLayout() {
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
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
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
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  body: { flex: 1 },
  root: { flex: 1 },
})

export default process.env.EXPO_PUBLIC_STORYBOOK === 'true' ? require('../../.rnstorybook').default : AppLayout
