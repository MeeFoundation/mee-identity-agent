import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { cn } from '@/shared/lib/cn'

export const Dialog = DialogPrimitive.Root

export const DialogPortal = DialogPrimitive.Portal

export const DialogBackdrop = ({ className, ...props }: DialogPrimitive.Backdrop.Props) => (
  <DialogPrimitive.Backdrop
    className={cn('pointer-events-auto absolute inset-0', className)}
    data-slot="dialog-backdrop"
    {...props}
  />
)

export const DialogPopup = ({ className, ...props }: DialogPrimitive.Popup.Props) => (
  <DialogPrimitive.Popup
    className={cn('pointer-events-auto outline-none', className)}
    data-slot="dialog-popup"
    {...props}
  />
)

export const DialogClose = ({ className, ...props }: DialogPrimitive.Close.Props) => (
  <DialogPrimitive.Close className={className} data-slot="dialog-close" {...props} />
)

export const DialogTitle = ({ className, ...props }: DialogPrimitive.Title.Props) => (
  <DialogPrimitive.Title className={className} data-slot="dialog-title" {...props} />
)

export const DialogDescription = ({ className, ...props }: DialogPrimitive.Description.Props) => (
  <DialogPrimitive.Description className={className} data-slot="dialog-description" {...props} />
)
