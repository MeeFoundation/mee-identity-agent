import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import { view } from './storybook.requires'
import { mmkvStorage } from '@/shared/storage'

const StorybookUI = view.getStorybookUI({
  storage: { getItem: mmkvStorage.getItem, setItem: mmkvStorage.setItem },
})

const StorybookRoot = () => {
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return <StorybookUI />
}

export default StorybookRoot
