// Web versions of the prototype's small design-system pieces (DSText, Icon, Avatar, CatHead, badges, gradients),
// sized and coloured as in the prototype so the overlays match it.

import { type CSSProperties, type ReactNode, useRef } from 'react'

import { useFrameStyle } from '../engine/frame'
import type { Box } from '../engine/values'
import { light, palette, type TypeSize, typeRamp } from '../scene/palette'
import { ICON_PATHS, type IconName } from './icons'

export const shadow = {
  1: '0px 1px 1px 0px #0206170d, 0px 0px 2px 0px #02061712',
  2: '0px 2px 2px 0px #0206170d, 0px 0px 3px 0px #02061712',
  3: '0px 6px 18px -1px #0206170d, 0px 2px 6px -1px #02061712',
  4: '0px 10px 20px -2px #0206170d, 0px 2px 15px -3px #02061712',
  focusBrand: '0px 0px 0px 3px #4f868e66',
} as const

const weights = { bold: 700, medium: 500, regular: 400, semibold: 600 } as const

type DSTextProps = {
  size?: TypeSize
  weight?: keyof typeof weights
  color?: string
  style?: CSSProperties
  children: ReactNode
  numberOfLines?: 1
  id?: string
}

export const DSText = ({
  size = 'base',
  weight = 'regular',
  color,
  style,
  children,
  numberOfLines,
  id,
}: DSTextProps) => {
  const ramp = typeRamp[size]
  return (
    <span
      id={id}
      style={{
        color,
        display: 'block',
        fontSize: ramp.size,
        fontWeight: weights[weight],
        letterSpacing: 0.005 * ramp.size,
        lineHeight: `${ramp.lineHeight}px`,
        ...(numberOfLines === 1 ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}),
        ...style,
      }}
    >
      {children}
    </span>
  )
}

export const Icon = ({
  name,
  size = 24,
  color = light['surface-gray-solid'],
}: {
  name: IconName
  size?: number
  color?: string
}) => (
  <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size}>
    {ICON_PATHS[name].map((path) => (
      <path d={path.d} fill={color} fillRule={'evenOdd' in path && path.evenOdd ? 'evenodd' : 'nonzero'} key={path.d} />
    ))}
  </svg>
)

export const CatHead = ({ size = 16 }: { size?: number }) => (
  <svg aria-hidden="true" height={size} viewBox="0 0 16 16" width={size}>
    <path d="M3.2 5.8 4.4 2.2 6.6 4.6Z M12.8 5.8 11.6 2.2 9.4 4.6Z" fill={palette['orange-500']} />
    <circle cx={8} cy={8.6} fill={palette['orange-500']} r={4.9} />
    <ellipse cx={8} cy={10.2} fill={palette['orange-100']} rx={2.2} ry={1.5} />
    <circle cx={6.3} cy={8} fill={palette['brand-950']} r={0.75} />
    <circle cx={9.7} cy={8} fill={palette['brand-950']} r={0.75} />
  </svg>
)

export const avatarSizes = { L: 48, M: 40, S: 32, XL: 64, XS: 24, XXS: 16 } as const
type AvatarSize = keyof typeof avatarSizes
const avatarText: Record<AvatarSize, TypeSize> = { L: 'lg', M: 'base', S: 'sm', XL: 'xl', XS: 'xs', XXS: 'xs' }
const avatarIcon: Record<AvatarSize, number> = { L: 24, M: 20, S: 16, XL: 32, XS: 12, XXS: 10 }
const smallAvatars: readonly AvatarSize[] = ['S', 'XS', 'XXS']

type AvatarProps = {
  size?: AvatarSize
  initials?: string
  icon?: IconName
  children?: ReactNode
  ring?: boolean
  holder?: string
  fg?: string
  shadow?: string
  tone?: 'pod' | 'person'
}

export const Avatar = ({
  size = 'M',
  initials,
  icon,
  children,
  ring,
  holder,
  fg,
  shadow: boxShadow,
  tone = 'pod',
}: AvatarProps) => {
  const k = avatarSizes[size]
  const person = tone === 'person'
  const bg = holder ?? (person ? light['surface-gray-light'] : light['surface-brand-light'])
  const iconColor = fg ?? (person ? light['text-default-placeholder'] : light['surface-brand-main'])
  const textColor =
    fg ??
    (person
      ? light['text-default-placeholder']
      : smallAvatars.includes(size)
        ? light['text-brand-solid']
        : light['surface-brand-main'])
  const inset = ring ? 2 : 0
  const inner = k - 2 * inset
  return (
    <span style={{ display: 'block', flexShrink: 0, height: k, position: 'relative', width: k }}>
      {ring || boxShadow ? (
        <span
          style={{
            backgroundColor: ring ? light['stroke-default-main'] : 'transparent',
            borderRadius: k / 2,
            boxShadow,
            height: k,
            left: 0,
            position: 'absolute',
            top: 0,
            width: k,
          }}
        />
      ) : null}
      <span
        style={{
          alignItems: 'center',
          backgroundColor: bg,
          borderRadius: inner / 2,
          display: 'flex',
          height: inner,
          justifyContent: 'center',
          left: inset,
          overflow: 'hidden',
          position: 'absolute',
          top: inset,
          width: inner,
        }}
      >
        {children ??
          (icon ? (
            <Icon color={iconColor} name={icon} size={avatarIcon[size]} />
          ) : (
            <DSText color={textColor} size={avatarText[size]} style={{ textAlign: 'center' }} weight="bold">
              {(initials ?? '').slice(0, k <= 24 ? 1 : 2)}
            </DSText>
          ))}
      </span>
    </span>
  )
}

const badgeColor = (tone: 'danger' | 'success' | 'brand') =>
  tone === 'danger'
    ? light['surface-error-solid']
    : tone === 'success'
      ? light['surface-success-solid']
      : light['surface-brand-solid']

// A notification dot that grows in with `scale`.
export const DotBadge = ({
  tone = 'danger',
  scale,
  style,
}: {
  tone?: 'danger' | 'success' | 'brand'
  scale?: Box<number>
  style?: CSSProperties
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  useFrameStyle(ref, () => {
    const s = scale ? scale.value : 1
    return { opacity: s > 0.001 ? 1 : 0, transform: [{ scale: s }] }
  })
  return (
    <span
      aria-hidden
      ref={ref}
      style={{
        alignItems: 'center',
        backgroundColor: light['stroke-default-main'],
        borderRadius: 6,
        display: 'flex',
        height: 12,
        justifyContent: 'center',
        pointerEvents: 'none',
        width: 12,
        ...style,
      }}
    >
      <span style={{ backgroundColor: badgeColor(tone), borderRadius: 4, height: 8, width: 8 }} />
    </span>
  )
}

// A horizontal gradient filling its parent, as the prototype's `LinearGradient` with start/end on the x axis.
export const LinearGradient = ({
  colors,
  angle = 90,
  style,
}: {
  colors: readonly string[]
  angle?: number
  style?: CSSProperties
}) => (
  <span
    aria-hidden
    style={{
      backgroundImage: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
      inset: 0,
      position: 'absolute',
      ...style,
    }}
  />
)

// Pads a control to a 44 px touch target without changing its layout.
export const hitTarget = (w: number, h: number, scale = 1, min = 44): CSSProperties => {
  const ph = Math.max(0, (min / scale - w) / 2)
  const pv = Math.max(0, (min / scale - h) / 2)
  return { margin: `${-pv}px ${-ph}px`, padding: `${pv}px ${ph}px` }
}
