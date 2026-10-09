type ChatSuggestionChipProps = {
  label: string
  onClick: () => void
}

export const ChatSuggestionChip = ({ label, onClick }: ChatSuggestionChipProps) => (
  <button
    className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 font-semibold text-[15px] text-brand-700 outline-none transition-colors hover:bg-brand-100 focus-visible:ring-3 focus-visible:ring-ring"
    onClick={onClick}
    type="button"
  >
    <span aria-hidden>+</span>
    {label}
  </button>
)
