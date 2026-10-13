import { type RefObject, useLayoutEffect, useState } from 'react'

const PHONE_QUERY = '(max-width: 480px)'

const computeScale = (area: HTMLElement, frameWidth: number, frameHeight: number) => {
  if (window.matchMedia(PHONE_QUERY).matches) return 1
  return Math.min(1, area.clientHeight / frameHeight, area.clientWidth / frameWidth)
}

export const useFrameScale = (areaRef: RefObject<HTMLElement | null>, frameWidth: number, frameHeight: number) => {
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const area = areaRef.current
    if (!area) return

    const update = () => setScale(computeScale(area, frameWidth, frameHeight))
    update()

    const observer = new ResizeObserver(update)
    observer.observe(area)
    return () => observer.disconnect()
  }, [areaRef, frameWidth, frameHeight])

  return scale
}
