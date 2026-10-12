import { ChevronRight, type Icon } from 'react-bootstrap-icons'

type RecordRowProps = {
  icon: Icon
  title: string
  description?: string
  // A quieter third line, e.g. when the record started.
  meta?: string
  onClick: () => void
}

// One record summarised in a list; a CategoryRow is a group, this is a single item of one.
export const RecordRow = ({ icon: RecordIcon, title, description, meta, onClick }: RecordRowProps) => (
  <button
    aria-label={[title, description, meta].filter(Boolean).join(', ')}
    className="flex w-full cursor-pointer items-center gap-2 rounded-2xl bg-white py-2 pr-4 pl-2 text-left shadow-card outline-none transition-colors hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring"
    onClick={onClick}
    type="button"
  >
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
      <RecordIcon aria-hidden className="text-brand-500" size={18} />
    </span>
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="font-medium text-base text-gray-900">{title}</span>
      {description && <span className="text-gray-700 text-sm">{description}</span>}
      {meta && <span className="text-gray-500 text-xs">{meta}</span>}
    </span>
    <ChevronRight aria-hidden className="shrink-0 text-gray-700" size={16} />
  </button>
)
