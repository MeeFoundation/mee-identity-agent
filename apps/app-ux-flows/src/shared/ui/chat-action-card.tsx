import type { Icon } from 'react-bootstrap-icons'

type ChatActionCardRow = {
  label: string
  value: string
}

type ChatActionCardProps = {
  title: string
  // A letter avatar is shown when no icon is given.
  avatarLetter?: string
  icon?: Icon
  rows: readonly ChatActionCardRow[]
  // A line above the action, e.g. once the action has been carried out.
  status?: string
  action: {
    label: string
    onAction: () => void
    disabled?: boolean
  }
}

// A card Telli embeds under its text, after the cards in the Figma "Pod / Chat - 5" frame.
export const ChatActionCard = ({ title, avatarLetter, icon: CardIcon, rows, status, action }: ChatActionCardProps) => (
  <section
    aria-label={title}
    className="flex w-67.5 max-w-full flex-col gap-3 rounded-2xl border border-gray-950/8 bg-white p-3"
  >
    <header className="flex items-center gap-2.5 border-gray-950/8 border-b pb-3">
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 font-medium text-brand-700"
      >
        {CardIcon ? <CardIcon size={18} /> : avatarLetter}
      </span>
      <h3 className="min-w-0 truncate font-medium text-base text-gray-900">{title}</h3>
    </header>
    {rows.length > 0 && (
      <dl className="flex flex-col gap-2">
        {rows.map((row) => (
          <div className="flex flex-col" key={row.label}>
            <dt className="text-gray-600 text-xs">{row.label}</dt>
            <dd className="text-base text-gray-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    )}
    {status && <output className="font-medium text-sm text-success-700">{status}</output>}
    <button
      className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-gray-300 font-semibold text-[15px] text-gray-700 outline-none transition-colors hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-default disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent"
      disabled={action.disabled}
      onClick={action.onAction}
      type="button"
    >
      {action.label}
    </button>
  </section>
)
