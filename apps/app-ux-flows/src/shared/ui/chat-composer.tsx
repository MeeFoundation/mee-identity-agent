import type { FormEvent } from 'react'
import { ArrowUp } from 'react-bootstrap-icons'

export const shouldSend = (value: string) => value.trim() !== ''

type ChatComposerProps = {
  value: string
  placeholder: string
  sendLabel: string
  onSend: () => void
  // Without it the text is fixed and cannot be edited.
  onChange?: (value: string) => void
}

export const ChatComposer = ({ value, placeholder, sendLabel, onSend, onChange }: ChatComposerProps) => {
  const canSend = shouldSend(value)

  // A form submits on Enter in the input as well as on the send button.
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (canSend) onSend()
  }

  return (
    <form
      className="flex items-center gap-2 rounded-3xl border border-gray-950/10 bg-white py-1 pr-1 pl-4 focus-within:ring-3 focus-within:ring-ring"
      onSubmit={submit}
    >
      <input
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent py-1 text-[15px] text-gray-900 outline-none placeholder:text-gray-500"
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        readOnly={!onChange}
        value={value}
      />
      <button
        aria-label={sendLabel}
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand-700 text-white outline-none transition-colors hover:bg-brand-800 disabled:cursor-default disabled:bg-gray-200 disabled:text-gray-400"
        disabled={!canSend}
        type="submit"
      >
        <ArrowUp aria-hidden size={16} />
      </button>
    </form>
  )
}
