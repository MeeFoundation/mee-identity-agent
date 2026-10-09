import type { ReactNode } from 'react'

type ChatThreadProps = {
  label: string
  children: ReactNode
}

// Anchored to the bottom so the newest message sits just above the composer.
export const ChatThread = ({ label, children }: ChatThreadProps) => (
  <div aria-label={label} className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain" role="log">
    <div className="mt-auto flex flex-col gap-3">{children}</div>
  </div>
)
