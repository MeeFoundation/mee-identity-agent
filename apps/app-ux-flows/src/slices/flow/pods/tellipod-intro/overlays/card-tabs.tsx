// Port of the prototype's `Tabs`: a segmented control whose selection slides with `index`, read every frame.

import { useRef } from 'react'

import { useFrameStyle } from '../engine/frame'
import { light } from '../scene/palette'
import { DSText, shadow } from './ui'

const TAB_H = 36
const INSET = 3
const GAP = 1

type CardTabsProps = {
  items: readonly string[]
  width?: number
  index: () => number
}

export const CardTabs = ({ items, width = 234, index }: CardTabsProps) => {
  const n = items.length
  const tabW = (width - 2 - 6 - GAP * (n - 1)) / n
  const step = tabW + GAP
  const thumbRef = useRef<HTMLSpanElement>(null)
  useFrameStyle(thumbRef, () => ({ transform: [{ translateX: index() * step }] }))

  return (
    <div
      style={{
        backgroundColor: light['alpha-dark-5'],
        border: `1px solid ${light['alpha-dark-10']}`,
        borderRadius: 12,
        boxSizing: 'border-box',
        height: 44,
        position: 'relative',
        width,
      }}
    >
      <span
        ref={thumbRef}
        style={{
          backgroundColor: light['surface-default-main'],
          borderRadius: 10,
          boxShadow: `0px 0px 0px 1px ${light['alpha-dark-10']}, ${shadow[2]}`,
          height: TAB_H,
          left: INSET,
          position: 'absolute',
          top: INSET,
          width: tabW,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'row', gap: GAP, left: INSET, position: 'absolute', top: INSET }}>
        {items.map((item) => (
          <span
            key={item}
            style={{ alignItems: 'center', display: 'flex', height: TAB_H, justifyContent: 'center', width: tabW }}
          >
            <DSText color={light['text-default-title']} numberOfLines={1} size="base" weight="semibold">
              {item}
            </DSText>
          </span>
        ))}
      </div>
    </div>
  )
}
