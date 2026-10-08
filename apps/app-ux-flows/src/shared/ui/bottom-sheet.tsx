import { type ReactNode, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useOverlayContainer } from '@/shared/lib/overlay-container'

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from './primitives/dialog'

type BottomSheetProps = {
  title: string
  description?: string
  children: ReactNode
  onDismiss: () => void
}

// Stays open while rendered: the flow shows it as its own screen and dismissing it navigates away.
export const BottomSheet = ({ title, description, children, onDismiss }: BottomSheetProps) => {
  const { t } = useTranslation()
  const container = useOverlayContainer()
  const popupRef = useRef<HTMLDivElement>(null)

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) onDismiss()
      }}
      open
    >
      <DialogPortal container={container}>
        <DialogBackdrop />
        <DialogPopup
          initialFocus={popupRef}
          ref={popupRef}
          className="absolute inset-x-0 bottom-0 flex max-h-full flex-col overflow-y-auto rounded-t-3xl bg-white pb-[calc(0.5rem+var(--home-indicator-h))] shadow-sheet transition-transform duration-300 ease-out data-ending-style:translate-y-full data-starting-style:translate-y-full"
        >
          <div aria-hidden className="flex h-4 shrink-0 justify-center pt-[5px]">
            <div className="h-1 w-15 rounded-full bg-gray-200" />
          </div>
          <div className="flex flex-col px-4 py-2">
            <DialogTitle className="font-medium text-gray-900 text-xl">{title}</DialogTitle>
            {description && <DialogDescription className="text-gray-600 text-sm">{description}</DialogDescription>}
          </div>
          <div className="p-4">{children}</div>
          <DialogClose className="sr-only rounded-lg px-2 py-1 font-semibold text-brand-700 text-sm outline-none focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:right-3 focus-visible:ring-3 focus-visible:ring-ring">
            {t('ui.bottomSheet.close')}
          </DialogClose>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
