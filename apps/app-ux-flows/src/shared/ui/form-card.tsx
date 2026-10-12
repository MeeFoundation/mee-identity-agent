import type { ReactNode } from 'react'
import { ChevronDown, type Icon, Pencil } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from './primitives/collapsible'

type FormCardProps = {
  icon: Icon
  title: string
  children: ReactNode
  footer?: ReactNode
}

export const FormCard = ({ icon: FormIcon, title, children, footer }: FormCardProps) => (
  <Collapsible className="flex flex-col overflow-clip rounded-2xl bg-white shadow-card" defaultOpen>
    <CollapsibleTrigger className="group flex w-full items-center gap-2 border-gray-200 border-b py-2 pr-4 pl-2 text-left hover:bg-gray-50 focus-visible:ring-inset">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
        <FormIcon aria-hidden className="text-brand-500" size={18} />
      </span>
      <span className="min-w-0 flex-1 font-medium text-base text-gray-900">{title}</span>
      <ChevronDown
        aria-hidden
        className="shrink-0 -rotate-90 text-gray-700 transition-transform duration-200 group-data-panel-open:rotate-0"
        size={16}
      />
    </CollapsibleTrigger>
    <CollapsiblePanel>
      <dl className="flex flex-col px-3">{children}</dl>
      {footer && <div className="px-2 pt-1 pb-2">{footer}</div>}
    </CollapsiblePanel>
  </Collapsible>
)

type FieldRowProps = {
  label: string
  value: string
  // Without it the row is read-only and shows no edit button.
  onEdit?: () => void
  // Shown in place of the value while the field is being edited; it carries its own visible label.
  editor?: ReactNode
}

export const FieldRow = ({ label, value, onEdit, editor }: FieldRowProps) => {
  const { t } = useTranslation()

  if (editor)
    return (
      <div className="py-3 pr-2">
        <dt className="sr-only">{label}</dt>
        <dd>{editor}</dd>
      </div>
    )

  return (
    <div className="flex items-center gap-3 py-3 pr-2">
      <div className="flex min-w-0 flex-1 flex-col">
        <dt className="-mb-0.5 text-gray-600 text-xs">{label}</dt>
        <dd className="font-medium text-base text-gray-800">{value}</dd>
      </div>
      {onEdit && (
        <button
          aria-label={t('ui.formCard.edit', { field: label })}
          className="-m-2 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg outline-none transition-colors hover:bg-gray-100 focus-visible:ring-3 focus-visible:ring-ring"
          onClick={onEdit}
          type="button"
        >
          <Pencil aria-hidden className="text-gray-700" size={16} />
        </button>
      )}
    </div>
  )
}
