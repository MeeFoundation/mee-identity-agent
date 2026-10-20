// Port of the prototype's `ButtonFace`: a button's look without its press handling, with a press overlay whose
// opacity can follow the story.

import { useRef } from 'react'

import { useFrameStyle } from '../engine/frame'
import { buttonGradient, light } from '../scene/palette'
import type { IconName } from './icons'
import { DSText, Icon, LinearGradient, shadow } from './ui'

const sizes = {
  L: { h: 44, icon: 24, labelPx: 8, px: 16, r: 12, ts: 'base' },
  M: { h: 36, icon: 20, labelPx: 8, px: 14, r: 12, ts: 'sm' },
  XXL: { h: 56, icon: 24, labelPx: 8, px: 24, r: 16, ts: 'xl' },
} as const

const variants = {
  primary: {
    border: light['stroke-brand-main'],
    fg: '#ffffff',
    pressedBorder: light['surface-brand-solid-hover'],
    pressedFill: light['surface-brand-solid-hover'],
  },
  secondary: {
    border: light['stroke-brand-accent'],
    fg: light['text-brand-solid'],
    pressedBorder: light['stroke-brand-accent'],
    pressedFill: light['surface-brand-soft-hover'],
  },
} as const

type ButtonFaceProps = {
  label: string
  size?: keyof typeof sizes
  variant?: keyof typeof variants
  iconLeft?: IconName
  block?: boolean
  height?: number
  // How pressed the button looks, 0..1, read every frame.
  pressed?: () => number
  // A real button's pressed and keyboard-focus states.
  pressedStatic?: boolean
  focused?: boolean
}

export const ButtonFace = ({
  label,
  size = 'M',
  variant = 'primary',
  iconLeft,
  block,
  height,
  pressed,
  pressedStatic = false,
  focused = false,
}: ButtonFaceProps) => {
  const s = sizes[size]
  const v = variants[variant]
  const pressRef = useRef<HTMLSpanElement>(null)
  useFrameStyle(pressRef, () => ({ opacity: pressedStatic ? 1 : pressed ? pressed() : 0 }))

  return (
    <span
      style={{
        alignItems: 'center',
        alignSelf: block ? 'stretch' : 'flex-start',
        backgroundColor: variant === 'secondary' ? light['surface-brand-soft'] : undefined,
        border: `1px solid ${v.border}`,
        borderRadius: s.r,
        boxShadow: focused && !pressedStatic ? shadow.focusBrand : undefined,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        height: height ?? s.h,
        justifyContent: 'center',
        overflow: 'hidden',
        padding: `0 ${s.px - s.labelPx / 2}px`,
        position: 'relative',
        width: block ? '100%' : undefined,
      }}
    >
      {variant === 'primary' ? <LinearGradient colors={buttonGradient} /> : null}
      <span
        ref={pressRef}
        style={{
          backgroundColor: v.pressedFill,
          border: `1px solid ${v.pressedBorder}`,
          borderRadius: s.r,
          inset: -1,
          opacity: 0,
          pointerEvents: 'none',
          position: 'absolute',
        }}
      />
      {iconLeft ? (
        <span style={{ display: 'flex', position: 'relative' }}>
          <Icon color={v.fg} name={iconLeft} size={s.icon} />
        </span>
      ) : null}
      <DSText
        color={v.fg}
        numberOfLines={1}
        size={s.ts}
        style={{ padding: `0 ${s.labelPx}px`, position: 'relative' }}
        weight="semibold"
      >
        {label}
      </DSText>
    </span>
  )
}
