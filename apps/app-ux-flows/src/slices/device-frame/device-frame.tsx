import { type CSSProperties, type ReactNode, useLayoutEffect, useRef } from 'react'

import { HomeIndicator } from './home-indicator'
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
          <div className="flex h-[852px] w-[393px] flex-col overflow-hidden rounded-[44px] bg-white max-[480px]:h-dvh max-[480px]:w-full max-[480px]:rounded-none">
            <StatusBar />
            <div className="flow-screen min-h-0 flex-1 overflow-y-auto overscroll-contain" ref={scrollRef}>
              {children}
            </div>
            <HomeIndicator />
          </div>
        </div>
      </div>
    </div>
  )
}
