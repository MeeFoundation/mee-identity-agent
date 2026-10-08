import { Plus } from 'react-bootstrap-icons'

import { CardWithAction } from './card-with-action'

type EmptyStateCardProps = {
  title: string
  message: string
  actionLabel: string
  onAction: () => void
}

export const EmptyStateCard = ({ title, message, actionLabel, onAction }: EmptyStateCardProps) => (
  <CardWithAction actionIcon={Plus} actionLabel={actionLabel} actionTone="primary" onAction={onAction}>
    <div className="flex flex-col items-center rounded-2xl bg-white p-4 pt-5.5 text-center text-gray-800 shadow-card">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-base">{message}</p>
    </div>
  </CardWithAction>
)
