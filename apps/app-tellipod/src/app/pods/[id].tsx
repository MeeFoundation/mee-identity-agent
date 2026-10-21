import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type PodTab, useAppChrome } from '@/shared/chrome'
import { PlaceholderScreen } from '@/shared/ui'

export default function PodInfoScreen() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<PodTab>('notes')

  useAppChrome({
    header: 'pod',
    pod: {
      breadcrumb: [
        { icon: 'people', label: t('pod.breadcrumb.people') },
        { label: t('pod.breadcrumb.immediateFamily') },
      ],
      onTabChange: setTab,
      tab,
      title: t('screens.podInfo'),
    },
  })

  return <PlaceholderScreen name={t('screens.podInfo')} />
}
