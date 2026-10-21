import type { Icon } from 'react-bootstrap-icons'

import { Button } from './button'

type FloatingActionButtonProps = {
  icon: Icon
  label: string
  onClick: () => void
}

// Pinned to the bottom-right of the nearest positioned container that does not scroll, such as a PodScreen.
export const FloatingActionButton = ({ icon: ActionIcon, label, onClick }: FloatingActionButtonProps) => (
  <Button
    className="absolute right-4 bottom-[calc(1rem+var(--home-indicator-h))] z-10 gap-3 px-5 shadow-card"
    onClick={onClick}
    size="l"
  >
    <ActionIcon aria-hidden size={24} />
    {label}
  </Button>
)
