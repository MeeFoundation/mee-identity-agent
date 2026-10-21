// Port of the prototype's `CellInfoRow`: a pod info row that Telli suggested, turning into a saved row as `confirm`
// goes from 0 to 1 (the "(suggested)" label and add icon fade out, the edit icon fades in).

import { useRef } from 'react'

import { useFrameStyle } from '../engine/frame'
import { light, palette } from '../scene/palette'
import { DSText, Icon } from './ui'

const PLUS_D =
  'M14.2 6.5C14.36 6.5 14.52 6.56 14.64 6.68C14.75 6.8 14.82 6.95 14.82 7.12V13.37H21.07C21.24 13.37 21.39 13.44 21.51 13.55C21.63 13.67 21.7 13.83 21.7 14C21.7 14.16 21.63 14.32 21.51 14.44C21.39 14.55 21.24 14.62 21.07 14.62H14.82V20.87C14.82 21.04 14.75 21.19 14.64 21.31C14.52 21.43 14.36 21.5 14.2 21.5C14.03 21.5 13.87 21.43 13.75 21.31C13.64 21.19 13.57 21.04 13.57 20.87V14.62H7.32C7.15 14.62 7 14.55 6.88 14.44C6.76 14.32 6.69 14.16 6.69 14C6.69 13.83 6.76 13.67 6.88 13.55C7 13.44 7.15 13.37 7.32 13.37H13.57V7.12C13.57 6.95 13.64 6.8 13.75 6.68C13.87 6.56 14.03 6.5 14.2 6.5Z'

const FilledCircleAdd = ({ size = 24 }: { size?: number }) => (
  <svg aria-hidden="true" height={size} viewBox="0 0 28 28" width={size}>
    <circle cx={14} cy={14} fill={palette['brand-500']} r={14} />
    <path d={PLUS_D} fill="#ffffff" fillRule="evenodd" />
  </svg>
)

type CellInfoRowProps = {
  label: string
  value: string
  width?: number
  divider?: boolean
  // How far the row has been confirmed, 0..1, read every frame.
  confirm: () => number
  suggestedLabel: string
}

export const CellInfoRow = ({ label, value, width = 234, divider, confirm, suggestedLabel }: CellInfoRowProps) => {
  const suggestedRef = useRef<HTMLSpanElement>(null)
  const addRef = useRef<HTMLSpanElement>(null)
  const editRef = useRef<HTMLSpanElement>(null)
  useFrameStyle(suggestedRef, () => {
    const c = confirm()
    return { opacity: 1 - c, transform: [{ translateX: -4 * c }] }
  })
  useFrameStyle(addRef, () => ({ opacity: 1 - confirm() }))
  useFrameStyle(editRef, () => ({ opacity: confirm() }))

  return (
    <div
      style={{
        borderBottom: divider ? `1px solid ${palette['gray-100']}` : undefined,
        boxSizing: 'border-box',
        height: 62,
        position: 'relative',
        width,
      }}
    >
      <div
        style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', left: 0, position: 'absolute', top: 11 }}
      >
        <DSText color={light['text-default-subtle']} size="xs">
          {label}
        </DSText>
        <span ref={suggestedRef} style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', marginLeft: 4 }}>
          <Icon color={light['surface-brand-main']} name="chat-ai-lock" size={12} />
          <DSText color={light['text-error-solid']} size="xs" style={{ marginLeft: 2 }}>
            {suggestedLabel}
          </DSText>
        </span>
      </div>
      <DSText
        color={light['text-default-body']}
        numberOfLines={1}
        size="base"
        style={{ left: 0, position: 'absolute', top: 29 }}
        weight="medium"
      >
        {value}
      </DSText>
      <div style={{ height: 24, position: 'absolute', right: 0, top: 19, width: 24 }}>
        <span ref={addRef} style={{ display: 'flex', left: 0, position: 'absolute', top: 0 }}>
          <FilledCircleAdd size={24} />
        </span>
        <span ref={editRef} style={{ display: 'flex', left: 4, position: 'absolute', top: 4 }}>
          <Icon color={light['surface-gray-solid']} name="pencil" size={16} />
        </span>
      </div>
    </div>
  )
}
