import { Plus } from 'react-bootstrap-icons'

import { CardWithAction } from './card-with-action'

type EmptyStateCardProps = {
  title: string
  message: string
  // Both or neither: without them the card has no "+ action" button.
  action?: { label: string; onAction: () => void }
}

export const EmptyStateCard = ({ title, message, action }: EmptyStateCardProps) => {
  const content = (
    <div className="flex flex-col items-center rounded-2xl bg-white p-4 pt-5.5 text-center text-gray-800 shadow-card">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-base">{message}</p>
    </div>
  )

  if (!action) return content

  return (
    <CardWithAction actionIcon={Plus} actionLabel={action.label} actionTone="primary" onAction={action.onAction}>
      {content}
    </CardWithAction>
  )
}
