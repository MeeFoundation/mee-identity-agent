import { Cookie, Plus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { Button } from './button'

type EmptyPodsCardProps = {
  onAddPod?: () => void
  onDismiss?: () => void
}

const noop = () => {}

export const EmptyPodsCard = ({ onAddPod, onDismiss = noop }: EmptyPodsCardProps) => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col items-start gap-4 rounded-2xl bg-white p-4 shadow-card">
      <span aria-hidden className="flex items-center rounded-full bg-brand-50 p-4">
        <Cookie className="text-brand-700" size={24} />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-2xl text-gray-900">{t('ui.podsSection.emptyTitle')}</h2>
        <p className="text-gray-800 text-sm">{t('ui.podsSection.emptyBody')}</p>
      </div>
      <div className="flex w-full flex-col gap-2">
        {onAddPod && (
          <Button className="w-full" onClick={onAddPod} size="l">
            <Plus aria-hidden className="shrink-0" size={24} />
            <span className="px-1">{t('ui.podsSection.addPod')}</span>
          </Button>
        )}
        <Button className="w-full" onClick={onDismiss} size="l" tone="secondary" variant="link">
          {t('ui.podsSection.maybeLater')}
        </Button>
      </div>
    </section>
  )
}
