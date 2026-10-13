import { CheckCircle, InfoCircle, X } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/cn'

type ToastVariant = 'primary' | 'success'

const variantStyles = {
  primary: {
    action: 'text-brand-700 hover:text-brand-800',
    icon: InfoCircle,
    surface: 'border-brand-300 bg-brand-50 text-gray-900',
  },
  success: {
    action: 'text-success-700 hover:text-success-800',
    icon: CheckCircle,
    surface: 'border-success-300 bg-success-50 text-success-950',
  },
} as const

type ToastProps = {
  variant?: ToastVariant
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  onClose: () => void
}

const controlClassName =
  'flex shrink-0 cursor-pointer items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring'

// After the Mee Design System toast; its parent places it on the screen.
export const Toast = ({ variant = 'primary', title, description, action, onClose }: ToastProps) => {
  const { t } = useTranslation()
  const styles = variantStyles[variant]
  const VariantIcon = styles.icon

  return (
    <output className={cn('flex items-start gap-2 rounded-lg border py-2.5 pr-2 pl-3 shadow-card', styles.surface)}>
      <VariantIcon aria-hidden className="mt-0.5 shrink-0" size={16} />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="font-medium text-sm">{title}</p>
        {description && <p className="text-sm opacity-80">{description}</p>}
      </div>
      {action && (
        <button
          className={cn(controlClassName, 'px-1.5 font-medium text-sm', styles.action)}
          onClick={action.onClick}
          type="button"
        >
          {action.label}
        </button>
      )}
      <button
        aria-label={t('ui.toast.close')}
        className={cn(controlClassName, 'size-5 hover:bg-gray-950/5')}
        onClick={onClose}
        type="button"
      >
        <X aria-hidden size={18} />
      </button>
    </output>
  )
}
