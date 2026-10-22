import type { ReactNode } from 'react'

import podBackground from './icons/pod-background.svg'
import { cn } from '@/shared/lib/cn'

type PodScreenProps = {
  topBar: ReactNode
  children: ReactNode
  // Pinned below the content, e.g. the app tab bar; it then owns the space above the home indicator.
  bottomBar?: ReactNode
}

// Extends behind the device status bar and home indicator so the gradient runs edge to edge, as in Figma.
export const PodScreen = ({ topBar, children, bottomBar }: PodScreenProps) => (
  <div className="relative isolate -mt-(--status-bar-h) -mb-(--home-indicator-h) flex h-[calc(100%+var(--status-bar-h)+var(--home-indicator-h))] flex-col overflow-hidden bg-white">
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[874px] overflow-hidden">
      <div className="absolute inset-[-97.39%_-158.09%_-94.58%_-163.76%]">
        <img alt="" className="block size-full max-w-none" src={podBackground} />
      </div>
    </div>
    <div className="relative z-10 shrink-0">{topBar}</div>
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain p-5',
        !bottomBar && 'pb-[calc(1.25rem+var(--home-indicator-h))]',
      )}
    >
      {children}
    </div>
    {bottomBar && <div className="relative z-10 shrink-0">{bottomBar}</div>}
  </div>
)
