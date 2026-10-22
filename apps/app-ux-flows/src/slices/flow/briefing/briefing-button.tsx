import { FlagIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BriefingContent, type BriefingProps } from './briefing-content'
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'

const PHONE_WIDTH_QUERY = '(max-width: 480px)'

// At phone widths the side panel is hidden, so a "Goal" pill over the screen opens the same briefing.
export const BriefingButton = (props: BriefingProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const completed = props.run?.completed ?? false

  // "Goal reached" opens by itself, but only where the button replaces the side panel.
  useEffect(() => {
    if (completed && window.matchMedia(PHONE_WIDTH_QUERY).matches) setOpen(true)
  }, [completed])

  const tryCase = (caseId: string) => {
    setOpen(false)
    props.onTryCase(caseId)
  }

  const restart = () => {
    setOpen(false)
    props.run?.restart()
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <button
        className="absolute top-2 left-1/2 z-40 hidden -translate-x-1/2 cursor-pointer items-center gap-1.5 rounded-full bg-gray-900/85 px-3 py-1.5 font-semibold text-white text-xs shadow-card outline-none focus-visible:ring-3 focus-visible:ring-ring max-[480px]:flex"
        onClick={() => setOpen(true)}
        type="button"
      >
        <FlagIcon aria-hidden className="size-3.5" />
        {t('flow.briefing.goal')}
      </button>
      <DialogPortal>
        <DialogBackdrop className="fixed z-50 bg-gray-950/50" />
        <DialogPopup className="fixed inset-x-3 top-3 z-50 flex max-h-[calc(100dvh-1.5rem)] flex-col gap-4 overflow-y-auto rounded-2xl bg-white p-4 shadow-sheet">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="font-semibold text-base text-gray-900">{t(props.flow.titleKey)}</DialogTitle>
            <DialogClose
              aria-label={t('flow.briefing.close')}
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-gray-700 outline-none hover:bg-gray-100 focus-visible:ring-3 focus-visible:ring-ring"
            >
              <XIcon aria-hidden className="size-4" />
            </DialogClose>
          </div>
          <BriefingContent
            {...props}
            onTryCase={tryCase}
            run={props.run && { completed: props.run.completed, restart }}
          />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
