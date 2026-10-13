import { type CSSProperties, type ReactNode, useLayoutEffect, useRef, useState } from 'react'

import { HomeIndicator } from './home-indicator'
import { OverlayContainerContext } from '@/shared/lib/overlay-container'
import { StatusBar } from './status-bar'
import { useFrameScale } from './use-frame-scale'

const SCREEN_WIDTH = 393
const SCREEN_HEIGHT = 852
const BEZEL = 12
const FRAME_WIDTH = SCREEN_WIDTH + BEZEL * 2
const FRAME_HEIGHT = SCREEN_HEIGHT + BEZEL * 2

type DeviceFrameProps = {
  screenKey: string
  children: ReactNode
}

export const DeviceFrame = ({ screenKey, children }: DeviceFrameProps) => {
  const areaRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const scale = useFrameScale(areaRef, FRAME_WIDTH, FRAME_HEIGHT)
  const [overlayContainer, setOverlayContainer] = useState<HTMLDivElement | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: each new screen must start scrolled to the top
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [screenKey])

  return (
    <div
      className="flex min-h-0 w-full flex-1 items-center justify-center max-[480px]:block"
      ref={areaRef}
      style={{ '--frame-scale': scale } as CSSProperties}
    >
      <div className="h-[calc(876px*var(--frame-scale))] w-[calc(417px*var(--frame-scale))] max-[480px]:h-dvh max-[480px]:w-full">
        <div className="w-fit origin-top-left rounded-[55px] bg-gray-900 p-3 shadow-2xl [transform:scale(var(--frame-scale))] max-[480px]:w-full max-[480px]:rounded-none max-[480px]:bg-transparent max-[480px]:p-0 max-[480px]:shadow-none max-[480px]:[transform:none]">
          <div className="relative flex h-[852px] w-[393px] flex-col overflow-hidden rounded-[44px] bg-white [--home-indicator-h:21px] [--status-bar-h:64px] max-[480px]:h-dvh max-[480px]:w-full max-[480px]:rounded-none max-[480px]:[--home-indicator-h:0px] max-[480px]:[--status-bar-h:0px]">
            <div className="absolute inset-x-0 top-0 z-20">
              <StatusBar />
            </div>
            <div className="relative flex min-h-0 flex-1 flex-col">
              <div
                className="flow-screen min-h-0 flex-1 overflow-y-auto overscroll-contain pt-(--status-bar-h) pb-(--home-indicator-h)"
                ref={scrollRef}
              >
                <OverlayContainerContext.Provider value={overlayContainer}>{children}</OverlayContainerContext.Provider>
              </div>
              <div
                className="pointer-events-none absolute inset-x-0 top-(--status-bar-h) bottom-0 overflow-hidden"
                ref={setOverlayContainer}
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
              <HomeIndicator />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
