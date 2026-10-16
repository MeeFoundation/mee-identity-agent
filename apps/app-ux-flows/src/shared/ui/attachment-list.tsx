import { Children, isValidElement, type ReactNode } from 'react'

import { Divider } from './divider'

type AttachmentListProps = {
  // Attachment rows, in the order they are shown.
  children: ReactNode
}

// The rows share one card, unlike CategoryRow and RecordRow, which are each a card of their own.
export const AttachmentList = ({ children }: AttachmentListProps) => (
  <ul className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card">
    {Children.toArray(children)
      .filter(isValidElement)
      .map((row, index) => (
        <li key={row.key}>
          {index > 0 && <Divider />}
          {row}
        </li>
      ))}
  </ul>
)
