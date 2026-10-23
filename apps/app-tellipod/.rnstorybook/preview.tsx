import '@/shared/i18n'

import {
  PublicSans_400Regular,
  PublicSans_500Medium,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
} from '@expo-google-fonts/public-sans'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import type { Decorator, Preview } from '@storybook/react-native'
import { useFonts } from 'expo-font'
import { Provider } from 'jotai'
import { StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const styles = StyleSheet.create({
  root: { flex: 1 },
})

const AppContext: Decorator = (Story) => {
  const [fontsLoaded, fontError] = useFonts({
    PublicSans_400Regular,
    PublicSans_500Medium,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
  })

  if (!fontsLoaded && fontError === null) {
    return <View />
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <Provider>
            <Story />
          </Provider>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const preview: Preview = {
  decorators: [AppContext],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
