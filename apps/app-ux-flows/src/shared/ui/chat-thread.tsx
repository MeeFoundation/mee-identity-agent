import type { ReactNode } from 'react'

type ChatThreadProps = {
  label: string
  children?: ReactNode
  // Shown centred instead of the messages, while the flow says the chat has none.
  empty?: ReactNode
}

// Anchored to the bottom so the newest message sits just above the composer.
// The log stays mounted while empty, so the first message is announced when it arrives.
export const ChatThread = ({ label, children, empty }: ChatThreadProps) => (
  <div aria-label={label} className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain" role="log">
    {empty ? (
      <div className="flex flex-1 items-center justify-center">{empty}</div>
    ) : (
      <div className="mt-auto flex flex-col gap-3">{children}</div>
    )}
  </div>
)
