import { Link } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useAppChrome } from '@/shared/chrome'
import { PlaceholderScreen } from '@/shared/ui'

export default function HomeScreen() {
  const { t } = useTranslation()

  useAppChrome({ header: 'home' })

  return (
    <View style={{ flex: 1 }}>
      <PlaceholderScreen name={t('screens.home')} />
      <Link href={{ pathname: '/pods/[id]', params: { id: '1' } }} style={{ padding: 24, textAlign: 'center' }}>
        {t('screens.podInfo')}
      </Link>
    </View>
  )
}
