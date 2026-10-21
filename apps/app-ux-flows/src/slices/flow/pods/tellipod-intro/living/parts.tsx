// The living-pod scene's static pieces, ported from the prototype's v2 shell module: pod tiles, member avatars, the
// note, file and chat rows on a pod card, and the pods list rows. They hold no animation; the scene moves them.

import type { CSSProperties, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import type { IconName } from '../overlays/icons'
import { Avatar, CatHead, DSText, Icon, shadow } from '../overlays/ui'
import { light, palette } from '../scene/palette'
import { POD_CATEGORY_ICON, POD_MEMBERS, type PodId } from './pods'

export const C = {
  body: light['text-default-body'],
  brand: palette['brand-500'],
  card: light['surface-default-main'],
  ph: light['text-default-placeholder'],
  soft: palette['gray-50'],
  stroke: palette['gray-200'],
  sub: light['text-default-subtle'],
  title: light['text-default-title'],
} as const

export const CARD_SHADOW = `0px 10px 24px -8px ${light['alpha-dark-15']}, 0px 1px 3px 0px ${light['alpha-dark-7']}`

export const abs = (left: number, top: number, extra: CSSProperties = {}): CSSProperties => ({
  left,
  position: 'absolute',
  top,
  ...extra,
})

export const absRight = (right: number, top: number, extra: CSSProperties = {}): CSSProperties => ({
  position: 'absolute',
  right,
  top,
  ...extra,
})

export const FILL: CSSProperties = { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }

// How a pod is named and where it is on the card, as the prototype's `PodTile` draws it.
export const PodTile = ({ pod, size = 40 }: { pod: PodId; size?: number }) => {
  const { t } = useTranslation()
  const radius = 0.27 * size
  if (pod === 'ginger')
    return (
      <span
        style={{
          alignItems: 'center',
          backgroundColor: palette['orange-100'],
          border: `1px solid ${palette['orange-200']}`,
          borderRadius: radius,
          boxSizing: 'border-box',
          display: 'flex',
          height: size,
          justifyContent: 'center',
          width: size,
        }}
      >
        <CatHead size={0.72 * size} />
      </span>
    )
  if (pod === 'sofia')
    return (
      <span
        style={{
          alignItems: 'center',
          backgroundColor: palette['brand-100'],
          borderRadius: size / 2,
          display: 'flex',
          height: size,
          justifyContent: 'center',
          width: size,
        }}
      >
        <DSText color={palette['brand-600']} size={size >= 40 ? 'base' : 'sm'} weight="bold">
          {t('pods.tellipodIntro.pod.sofiaInitial')}
        </DSText>
      </span>
    )
  return (
    <span
      style={{
        alignItems: 'center',
        backgroundColor: pod === 'kyoto' ? palette['brand-500'] : palette['brand-700'],
        borderRadius: radius,
        display: 'flex',
        height: size,
        justifyContent: 'center',
        width: size,
      }}
    >
      <Icon color="#ffffff" name={pod === 'kyoto' ? 'airplane' : 'house'} size={0.5 * size} />
    </span>
  )
}

export type Who = 'you' | 'telli' | { initial: string }

export const Member = ({ who }: { who: Who }) =>
  who === 'you' ? (
    <Avatar icon="person" ring size="XS" tone="person" />
  ) : who === 'telli' ? (
    <Avatar icon="chat-ai-lock" ring size="XS" />
  ) : (
    <Avatar initials={who.initial} ring size="XS" tone="person" />
  )

// Member avatars overlapping by 6 px, the first on top.
export const StaticStack = ({ people }: { people: readonly Who[] }) => {
  const n = people.length
  return (
    <span style={{ display: 'block', height: 24, position: 'relative', width: 24 + 18 * (n - 1) }}>
      {people.map((who, i) => (
        <span
          key={typeof who === 'string' ? who : who.initial}
          style={{ left: 18 * i, position: 'absolute', top: 0, zIndex: n - i }}
        >
          <Member who={who} />
        </span>
      ))}
    </span>
  )
}

export const useMembers = (pod: PodId): readonly Who[] => {
  const { t } = useTranslation()
  return POD_MEMBERS[pod].map((who) =>
    who === 'you' ? 'you' : { initial: t(`pods.tellipodIntro.living.pods.${pod}.memberInitial`) },
  )
}

export const CatLine = ({ icon, text, color = C.sub }: { icon: IconName; text: string; color?: string }) => (
  <span style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', gap: 4 }}>
    <Icon color={color} name={icon} size={12} />
    <DSText color={color} numberOfLines={1} size="xs">
      {text}
    </DSText>
  </span>
)

export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <DSText color={C.sub} size="xs" weight="medium">
    {children}
  </DSText>
)

export const NoteBox = ({ text, width }: { text: string; width: number }) => (
  <span
    style={{
      backgroundColor: C.soft,
      border: `1px solid ${palette['gray-100']}`,
      borderRadius: 12,
      boxSizing: 'border-box',
      display: 'block',
      padding: '6px 10px',
      width,
    }}
  >
    <DSText color={C.body} size="sm">
      {text}
    </DSText>
  </span>
)

export const FileRow = ({ name, icon, width }: { name: string; icon: IconName; width: number }) => (
  <span
    style={{
      alignItems: 'center',
      backgroundColor: C.soft,
      border: `1px solid ${palette['gray-100']}`,
      borderRadius: 10,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      height: 34,
      padding: '0 8px',
      width,
    }}
  >
    <span
      style={{
        alignItems: 'center',
        backgroundColor: light['surface-brand-light'],
        borderRadius: 6,
        display: 'flex',
        height: 22,
        justifyContent: 'center',
        width: 22,
      }}
    >
      <Icon color={palette['brand-600']} name={icon} size={13} />
    </span>
    <DSText color={C.body} numberOfLines={1} size="sm" weight="medium">
      {name}
    </DSText>
    <span style={{ flex: 1 }} />
    <Icon color={palette['gray-400']} name="paperclip" size={13} />
  </span>
)

export const InBubble = ({ from, text, time }: { from: string; text: string; time: string }) => (
  <span style={{ alignItems: 'flex-end', display: 'flex', flexDirection: 'row', gap: 6 }}>
    <Avatar initials={from} size="XS" tone="person" />
    <span
      style={{
        alignItems: 'baseline',
        backgroundColor: light['surface-default-main'],
        borderBottomLeftRadius: 4,
        borderRadius: 10,
        boxShadow: `0px 0px 0px 1px ${light['alpha-dark-7']}, ${shadow[1]}`,
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        padding: '4px 10px',
      }}
    >
      <DSText color={C.body} numberOfLines={1} size="sm">
        {text}
      </DSText>
      <DSText color={light['alpha-dark-60']} numberOfLines={1} size="2xs">
        {time}
      </DSText>
    </span>
  </span>
)

export const OutBubble = ({ text, time }: { text: string; time: string }) => (
  <span
    style={{
      alignItems: 'baseline',
      alignSelf: 'flex-end',
      backgroundColor: light['surface-default-main-reversed'],
      borderBottomRightRadius: 4,
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'row',
      gap: 6,
      padding: '4px 10px',
    }}
  >
    <DSText color="#ffffff" numberOfLines={1} size="sm">
      {text}
    </DSText>
    <DSText color={light['alpha-white-70']} numberOfLines={1} size="2xs">
      {time}
    </DSText>
  </span>
)

export const MessageField = ({ width, h = 30 }: { width: number; h?: number }) => {
  const { t } = useTranslation()
  return (
    <span
      style={{
        alignItems: 'center',
        backgroundColor: '#ffffff',
        border: `1px solid ${palette['gray-200']}`,
        borderRadius: 10,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        height: h,
        paddingLeft: 10,
        paddingRight: 4,
        width,
      }}
    >
      <DSText color={C.ph} numberOfLines={1} size="xs" style={{ flex: 1 }}>
        {t('pods.tellipodIntro.pod.messagePlaceholder')}
      </DSText>
      <span
        style={{
          alignItems: 'center',
          backgroundColor: palette['brand-300'],
          borderRadius: (h - 10) / 2,
          display: 'flex',
          height: h - 10,
          justifyContent: 'center',
          width: h - 10,
        }}
      >
        <span style={{ display: 'flex', transform: 'translate(-0.5958px, 0.5958px)' }}>
          <Icon color="#ffffff" name="send" size={11} />
        </span>
      </span>
    </span>
  )
}

// A saved info row on the pod card: label, value and an edit icon.
export const FieldBox = ({ label, value, width }: { label: string; value: string; width: number }) => (
  <span
    style={{
      backgroundColor: C.soft,
      border: `1px solid ${palette['gray-100']}`,
      borderRadius: 10,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      height: 46,
      justifyContent: 'center',
      padding: '0 10px',
      position: 'relative',
      width,
    }}
  >
    <DSText color={C.sub} numberOfLines={1} size="xs">
      {label}
    </DSText>
    <DSText color={C.body} numberOfLines={1} size="sm" weight="medium">
      {value}
    </DSText>
    <span style={{ display: 'flex', position: 'absolute', right: 8, top: 15 }}>
      <Icon color={palette['gray-400']} name="pencil" size={13} />
    </span>
  </span>
)

export const Bar = ({ w, h = 8, color = palette['gray-100'] }: { w: number; h?: number; color?: string }) => (
  <span style={{ backgroundColor: color, borderRadius: h / 2, display: 'block', height: h, width: w }} />
)

const SYNC_ARROWS =
  'M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z'
const SYNC_LOOP =
  'M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z'

export const SyncGlyph = ({ size = 14, color = '#ffffff' }: { size?: number; color?: string }) => (
  <svg aria-hidden="true" height={size} viewBox="0 0 16 16" width={size}>
    <path d={SYNC_ARROWS} fill={color} />
    <path d={SYNC_LOOP} fill={color} fillRule="evenodd" />
  </svg>
)

const FormatLetter = ({ children, style }: { children: string; style: CSSProperties }) => (
  <DSText color={palette['gray-600']} size="base" style={style} weight="semibold">
    {children}
  </DSText>
)

const FormatDivider = () => (
  <span style={{ backgroundColor: palette['gray-200'], display: 'block', height: 18, width: 1 }} />
)

// The note editor's formatting toolbar.
export const FormatBar = ({ width }: { width: number }) => (
  <span
    style={{
      alignItems: 'center',
      backgroundColor: C.soft,
      border: `1px solid ${palette['gray-200']}`,
      borderRadius: 12,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      height: 38,
      justifyContent: 'space-around',
      padding: '0 6px',
      width,
    }}
  >
    <Icon color={palette['gray-600']} name="link-45deg" size={18} />
    <Icon color={palette['gray-600']} name="image" size={17} />
    <FormatDivider />
    <FormatLetter style={{ fontWeight: 700 }}>B</FormatLetter>
    <FormatLetter style={{ fontStyle: 'italic', fontWeight: 400 }}>I</FormatLetter>
    <FormatLetter style={{ fontWeight: 400, textDecoration: 'underline' }}>U</FormatLetter>
    <FormatLetter style={{ fontWeight: 400, textDecoration: 'line-through' }}>S</FormatLetter>
    <FormatDivider />
    <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Bar color={palette['gray-600']} h={2} w={14} />
      <Bar color={palette['gray-600']} h={2} w={10} />
      <Bar color={palette['gray-600']} h={2} w={14} />
    </span>
  </span>
)

// One pod in the list on the last beat.
export const PodRow = ({ pod }: { pod: PodId }) => {
  const { t } = useTranslation()
  const members = useMembers(pod)
  const key = (path: string) => `pods.tellipodIntro.living.pods.${pod}.${path}`
  return (
    <span
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.stroke}`,
        borderRadius: 16,
        boxShadow: shadow[2],
        boxSizing: 'border-box',
        display: 'block',
        height: 60,
        position: 'relative',
        width: 330,
      }}
    >
      <span style={abs(15, 9)}>
        <PodTile pod={pod} />
      </span>
      <span style={abs(65, 9)}>
        <DSText color={C.title} numberOfLines={1} size="base" weight="semibold">
          {t(key('name'))}
        </DSText>
      </span>
      <span style={abs(65, 32)}>
        <CatLine icon={POD_CATEGORY_ICON[pod]} text={t(key('category'))} />
      </span>
      <span style={absRight(41, 17)}>
        <StaticStack people={members} />
      </span>
      <span style={absRight(13, 21)}>
        <Icon color={palette['gray-400']} name="chevron-right" size={16} />
      </span>
    </span>
  )
}

// The chip that carries the one-time link along the line to Paula's phone.
export const KeyChipFace = ({ label }: { label: string }) => (
  <span
    style={{
      alignItems: 'center',
      backgroundColor: light['surface-brand-soft'],
      border: `1px solid ${light['stroke-brand-light']}`,
      borderRadius: 4,
      boxShadow: shadow[3],
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      height: 24,
      padding: '2px 10px 2px 0',
    }}
  >
    <span style={{ display: 'flex', paddingLeft: 6 }}>
      <Icon color={light['text-brand-on-soft-background']} name="key" size={16} />
    </span>
    <DSText
      color={light['text-brand-on-soft-background']}
      numberOfLines={1}
      size="xs"
      style={{ paddingLeft: 8 }}
      weight="semibold"
    >
      {label}
    </DSText>
  </span>
)
