import { CircleCheckIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/button'

type CompletionViewProps = {
  titleKey: string
  onRestart: () => void
  onExit: () => void
}

export const CompletionView = ({ titleKey, onRestart, onExit }: CompletionViewProps) => {
  const { t } = useTranslation()

  return (
    <section className="flex min-h-full flex-col items-center justify-center gap-6 p-6 text-center">
      <CircleCheckIcon aria-hidden className="size-14 text-success-600" strokeWidth={1.5} />
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-2xl text-gray-900">{t('flow.completion.title')}</h1>
        <p className="text-muted-foreground">{t('flow.completion.body', { title: t(titleKey) })}</p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <Button className="w-full" onClick={onRestart} size="l">
          {t('flow.completion.restart')}
        </Button>
        <Button className="w-full" onClick={onExit} size="l" variant="outlined">
          {t('flow.completion.allFlows')}
        </Button>
      </div>
    </section>
  )
}
