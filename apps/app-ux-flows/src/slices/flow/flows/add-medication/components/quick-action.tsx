import type { QuickActionProps } from '../model'

export const QuickAction = ({ label, description, onClick }: QuickActionProps) => (
  <button onClick={onClick} type="button">
    <strong>{label}</strong>
    <br />
    <span>{description}</span>
  </button>
)
