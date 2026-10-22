import { useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { Button, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { onboardedAtom } from './model'
import { useAppChrome } from '@/shared/chrome'

export const OnboardingScreen = () => {
  const { t } = useTranslation()
  const setOnboarded = useSetAtom(onboardedAtom)

  useAppChrome({ footer: 'hidden', header: 'none' })

  return (
    <SafeAreaView style={styles.container}>
      <Text>{t('onboarding.title')}</Text>
      <Button onPress={() => setOnboarded(true)} title={t('onboarding.start')} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, gap: 16, justifyContent: 'center' },
})
