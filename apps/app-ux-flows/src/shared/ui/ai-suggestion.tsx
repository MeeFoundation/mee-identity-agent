import { Stars } from 'react-bootstrap-icons'

type AiSuggestionProps = {
  caption: string
  label: string
  onClick: () => void
}

export const AiSuggestion = ({ caption, label, onClick }: AiSuggestionProps) => (
  <button
    className="flex h-13 w-full cursor-pointer items-center gap-1.5 rounded-lg border border-brand-300 bg-brand-100 px-2.5 text-left outline-none transition-colors hover:bg-brand-200 focus-visible:ring-3 focus-visible:ring-ring"
    onClick={onClick}
    type="button"
  >
    <Stars aria-hidden className="shrink-0 text-gray-700" size={32} />
    <span className="flex min-w-0 flex-col">
      <span className="text-gray-600 text-xs">{caption}</span>
      <span className="-mt-0.5 font-semibold text-base text-brand-700">{label}</span>
    </span>
  </button>
)
