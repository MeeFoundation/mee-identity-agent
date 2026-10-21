import { useTranslation } from 'react-i18next'

import { useAppChrome } from '@/shared/chrome'
import { PlaceholderScreen } from '@/shared/ui'

export default function NavigationScreen() {
  const { t } = useTranslation()

  useAppChrome({ header: 'back-search' })

  return <PlaceholderScreen name={t('screens.navigation')} />
}
