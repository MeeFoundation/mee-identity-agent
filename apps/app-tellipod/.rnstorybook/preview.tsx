import '@/shared/i18n'

import {
  PublicSans_400Regular,
  PublicSans_500Medium,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
} from '@expo-google-fonts/public-sans'
import type { Decorator, Preview } from '@storybook/react-native'
import { useFonts } from 'expo-font'
import { Provider } from 'jotai'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

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
    <SafeAreaProvider>
      <Provider>
        <Story />
      </Provider>
    </SafeAreaProvider>
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
