import type { ReactNode } from 'react'
import { CheckCircle, ExclamationOctagon, ExclamationTriangle, InfoCircle, X } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/cn'

export type ToastVariant = 'primary' | 'secondary' | 'tertiary' | 'dark' | 'success' | 'danger' | 'warning'

const variantStyles = {
  danger: {
    action: 'text-error-700 hover:text-error-800',
    description: 'text-error-800',
    icon: ExclamationOctagon,
    surface: 'border-error-300 bg-error-50',
    title: 'text-error-900',
  },
  dark: {
    action: 'text-brand-200 hover:text-brand-100',
    description: 'text-white',
    icon: InfoCircle,
    surface: 'border-gray-700 bg-gray-900',
    title: 'text-white',
  },
  primary: {
    action: 'text-brand-700 hover:text-brand-800',
    description: 'text-brand-800',
    icon: InfoCircle,
    surface: 'border-brand-300 bg-brand-50',
    title: 'text-brand-900',
  },
  secondary: {
    action: 'text-brand-700 hover:text-brand-800',
    description: 'text-gray-800',
    icon: InfoCircle,
    surface: 'border-gray-200 bg-white',
    title: 'text-gray-900',
  },
  success: {
    action: 'text-success-700 hover:text-success-800',
    description: 'text-success-800',
    icon: CheckCircle,
    surface: 'border-success-300 bg-success-50',
    title: 'text-success-900',
  },
  tertiary: {
    action: 'text-brand-700 hover:text-brand-800',
    description: 'text-gray-800',
    icon: InfoCircle,
    surface: 'border-gray-300 bg-gray-50',
    title: 'text-gray-900',
  },
  warning: {
    action: 'text-warning-700 hover:text-warning-800',
    description: 'text-warning-800',
    icon: ExclamationTriangle,
    surface: 'border-warning-300 bg-warning-50',
    title: 'text-warning-900',
  },
} as const

type ToastAction = { label: string; onClick: () => void }

type ToastProps = {
  variant?: ToastVariant
  title?: string
  description?: string
  /** A node replaces the variant's icon; `null` hides it. */
  icon?: ReactNode
  avatar?: ReactNode
  action?: ToastAction
  actions?: readonly [ToastAction] | readonly [ToastAction, ToastAction]
  actionsPlacement?: 'right' | 'bottom'
  onClose: () => void
}

const controlClassName =
  'flex shrink-0 cursor-pointer items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring'

// After the Mee Design System toast; its parent places it on the screen.
export const Toast = ({
  variant = 'primary',
  title,
  description,
  icon,
  avatar,
  action,
  actions,
  actionsPlacement = 'right',
  onClose,
}: ToastProps) => {
  const { t } = useTranslation()
  const styles = variantStyles[variant]
  const VariantIcon = styles.icon
  const iconNode = icon === undefined ? <VariantIcon aria-hidden size={16} /> : icon
  const hasIcon = iconNode !== null
  const links = actions ?? (action ? [action] : [])
  const actionLinks = links.map(({ label, onClick }) => (
    <button
      className={cn(controlClassName, 'font-normal text-sm', styles.action)}
      key={label}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  ))

  return (
    <output className={cn('flex items-start gap-2 rounded-lg border px-4 py-3 shadow-card', styles.surface)}>
      {avatar ? <div className="shrink-0 self-stretch">{avatar}</div> : null}
      <div className="flex min-w-0 flex-1 flex-col">
        {hasIcon || title ? (
          <div className="flex items-start gap-1.5">
            {hasIcon ? (
              <span className={cn('flex h-5 w-4 shrink-0 items-center justify-center', styles.title)}>{iconNode}</span>
            ) : null}
            {title ? <p className={cn('min-w-0 flex-1 font-semibold text-sm', styles.title)}>{title}</p> : null}
          </div>
        ) : null}
        {description ? <p className={cn('text-sm', styles.description, hasIcon && 'pl-5.5')}>{description}</p> : null}
        {actionsPlacement === 'bottom' && actionLinks.length > 0 ? (
          <div className={cn('flex items-center gap-4 pt-1.5', hasIcon && 'pl-5')}>{actionLinks}</div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-start gap-4">
        {actionsPlacement === 'right' && actionLinks.length > 0 ? (
          <div className="flex items-center gap-4">{actionLinks}</div>
        ) : null}
        <button
          aria-label={t('ui.toast.close')}
          className={cn(controlClassName, 'size-5 hover:bg-gray-950/5', styles.title)}
          onClick={onClose}
          type="button"
        >
          <X aria-hidden size={20} />
        </button>
      </div>
    </output>
  )
}
