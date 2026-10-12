import { useTranslation } from 'react-i18next'

import { useOverlayContainer } from '@/shared/lib/overlay-container'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogBackdrop, DialogPopup, DialogPortal, DialogTitle } from '@/shared/ui/primitives/dialog'

import { type BriefingFlow, CaseLabel } from './briefing-content'

type MissionCardProps = {
  flow: BriefingFlow
  onStart: () => void
}

// Briefs the tester over the phone screen, which stays inert until "Start".
export const MissionCard = ({ flow, onStart }: MissionCardProps) => {
  const { t } = useTranslation()
  const container = useOverlayContainer()

  return (
    <Dialog
      disablePointerDismissal
      modal="trap-focus"
      onOpenChange={(next) => {
        if (!next) onStart()
      }}
      open
    >
      <DialogPortal container={container}>
        <DialogBackdrop className="bg-gray-950/50" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
          <DialogPopup className="flex w-full flex-col gap-4 rounded-3xl bg-white p-6 text-sm shadow-sheet">
            <DialogTitle className="font-semibold text-gray-900 text-xl">{t(flow.titleKey)}</DialogTitle>
            <CaseLabel flow={flow} />
            {flow.goalKey && (
              <section className="flex flex-col gap-1">
                <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  {t('flow.briefing.yourGoal')}
                </h3>
                <p className="text-base text-gray-900">{t(flow.goalKey)}</p>
              </section>
            )}
            <Button className="w-full" onClick={onStart} size="l">
              {t('flow.briefing.start')}
            </Button>
          </DialogPopup>
        </div>
      </DialogPortal>
    </Dialog>
  )
}
