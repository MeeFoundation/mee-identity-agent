import { Button } from '@/shared/ui/button'

import type { QuickActionProps } from '../model'

export const ProminentQuickAction = ({ label, description, onClick }: QuickActionProps) => (
  <aside className="flex flex-col gap-3">
    <p className="text-muted-foreground text-sm">{description}</p>
    <Button className="w-full" onClick={onClick} size="xxl">
      {label}
    </Button>
  </aside>
)
