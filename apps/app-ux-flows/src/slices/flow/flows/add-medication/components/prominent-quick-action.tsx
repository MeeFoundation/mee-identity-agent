import type { QuickActionProps } from '../model'

export const ProminentQuickAction = ({ label, description, onClick }: QuickActionProps) => (
  <aside>
    <p>{description}</p>
    <button onClick={onClick} style={{ fontSize: '1.5rem', padding: '1rem', width: '100%' }} type="button">
      {label}
    </button>
  </aside>
)
