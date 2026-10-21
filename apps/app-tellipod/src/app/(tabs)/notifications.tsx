import { useTranslation } from 'react-i18next'

import { useAppChrome } from '@/shared/chrome'
import { PlaceholderScreen } from '@/shared/ui'

export default function NotificationsScreen() {
  const { t } = useTranslation()

  useAppChrome({ header: 'home' })

  return <PlaceholderScreen name={t('screens.notifications')} />
}
