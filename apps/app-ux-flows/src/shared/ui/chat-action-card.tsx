import { type Icon, Pencil } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { CountBadge } from './count-badge'

type ChatActionCardRow = {
  label: string
  value: string
  // Shows a pencil at the end of the row.
  onEdit?: () => void
}

type ChatActionCardProps = {
  title: string
  // A letter avatar is shown when no icon is given.
  avatarLetter?: string
  icon?: Icon
  rows: readonly ChatActionCardRow[]
  // A line above the action, e.g. once the action has been carried out.
  status?: string
  action?: {
    label: string
    onAction: () => void
    disabled?: boolean
    count?: number
  }
}

// A "Card-Cell-Details-Preview" Telli embeds in its bubble, after the Figma "Pod / Chat - 5" frame.
export const ChatActionCard = ({ title, avatarLetter, icon: CardIcon, rows, status, action }: ChatActionCardProps) => {
  const { t } = useTranslation()

  return (
    <section aria-label={title} className="flex w-full flex-col overflow-clip rounded-2xl bg-white shadow-card">
      <header className="flex items-center gap-2 py-2 pr-4 pl-2">
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-700 text-sm"
        >
          {CardIcon ? <CardIcon size={18} /> : avatarLetter}
        </span>
        <h3 className="min-w-0 flex-1 truncate font-medium text-base text-gray-900">{title}</h3>
      </header>
      {rows.length > 0 && (
        <dl className="flex flex-col px-3">
          {rows.map((row) => (
            <div className="flex items-center gap-3 border-gray-100 border-t py-3 pr-2" key={row.label}>
              <div className="flex min-w-0 flex-1 flex-col">
                <dt className="-mb-0.5 text-gray-600 text-xs">{row.label}</dt>
                <dd className="break-words font-medium text-base text-gray-800">{row.value}</dd>
              </div>
              {row.onEdit && (
                <button
                  aria-label={t('ui.chatActionCard.edit', { label: row.label })}
                  className="-m-1.5 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-700 outline-none transition-colors hover:bg-gray-100 focus-visible:ring-3 focus-visible:ring-ring"
                  onClick={row.onEdit}
                  type="button"
                >
                  <Pencil aria-hidden size={16} />
                </button>
              )}
            </div>
          ))}
        </dl>
      )}
      {status && <output className="px-3 pb-2 font-medium text-sm text-success-700">{status}</output>}
      {action && (
        <div className="px-2 pt-1 pb-2">
          <button
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 font-semibold text-base text-gray-700 outline-none transition-colors hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-default disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent"
            disabled={action.disabled}
            onClick={action.onAction}
            type="button"
          >
            {action.label}
            {action.count !== undefined && <CountBadge count={action.count} tone="gray" />}
          </button>
        </div>
      )}
    </section>
  )
}
