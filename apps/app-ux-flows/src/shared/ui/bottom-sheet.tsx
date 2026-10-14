import { type ReactNode, type RefObject, useEffect, useRef, useState } from 'react'
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
  title: ReactNode
  description?: string
  children: ReactNode
  onDismiss: () => void
  // Takes focus when the sheet opens; the sheet itself by default.
  initialFocus?: RefObject<HTMLElement | null>
}

// Shown by the flow as its own screen: it slides up once mounted, and on dismiss slides down before the flow navigates away.
export const BottomSheet = ({ title, description, children, onDismiss, initialFocus }: BottomSheetProps) => {
  const { t } = useTranslation()
  const container = useOverlayContainer()
  const popupRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const openedRef = useRef(false)

  // Mounting closed and opening on the next frame gives the open transition a starting point.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <Dialog
      onOpenChange={(next, details) => {
        if (next) return
        // A second click on the control that opened the sheet lands on the backdrop while the sheet slides up;
        // it must not dismiss a sheet the participant has not seen yet.
        if (!openedRef.current && details.reason === 'outside-press') return
        setOpen(false)
      }}
      onOpenChangeComplete={(isOpen) => {
        openedRef.current = isOpen
        if (!isOpen) onDismiss()
      }}
      open={open}
    >
      <DialogPortal container={container}>
        <DialogBackdrop className="bg-gray-950/40 transition-opacity duration-300 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPopup
          className="absolute inset-x-0 bottom-0 flex max-h-full flex-col overflow-y-auto rounded-t-3xl bg-white pb-[calc(0.5rem+var(--home-indicator-h))] shadow-sheet transition-transform duration-300 ease-out data-ending-style:translate-y-full data-starting-style:translate-y-full"
          initialFocus={initialFocus ?? popupRef}
          ref={popupRef}
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
