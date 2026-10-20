// The first beat's deck: pod cards fall one after another, and the last (Ginger) stays on top. Ported from the
// prototype's `SceneV2` deck cards and the pod card's preview body.

import { memo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useFrameStyle } from '../engine/frame'
import { DECK_N, deckFace, deckPose, headPadR, headTop, P1, T1_V2 } from '../engine/living'
import { remap } from '../engine/math'
import { DSText } from '../overlays/ui'
import { palette } from '../scene/palette'
import {
  abs,
  absRight,
  C,
  CARD_SHADOW,
  CatLine,
  FILL,
  FileRow,
  InBubble,
  MessageField,
  NoteBox,
  OutBubble,
  PodTile,
  SectionLabel,
  StaticStack,
  useMembers,
} from './parts'
import { DECK_PODS, POD_CATEGORY_ICON, POD_CHAT_IS_MINE, POD_FILE_ICON, type PodId } from './pods'

// The width of the rows in a pod card's body: the card less its 15 px margins.
const PREVIEW_W = P1.w - 2 - 30

export const CardHandle = () => (
  <span style={{ backgroundColor: palette['gray-200'], borderRadius: 2, display: 'block', height: 4, width: 36 }} />
)

// A pod's note, file and last message, as the card shows them on the first beat.
export const PreviewBody = ({ pod }: { pod: PodId }) => {
  const { t } = useTranslation()
  const key = (path: string) => `pods.tellipodIntro.living.pods.${pod}.${path}`
  const text = t(key('chat.text'))
  const time = t(key('chat.time'))
  return (
    <>
      <span style={abs(15, 68)}>
        <SectionLabel>{t('pods.tellipodIntro.living.labels.note')}</SectionLabel>
      </span>
      <span style={abs(15, 86)}>
        <NoteBox text={t(key('note'))} width={PREVIEW_W} />
      </span>
      <span style={abs(15, 130)}>
        <SectionLabel>{t('pods.tellipodIntro.living.labels.files')}</SectionLabel>
      </span>
      <span style={abs(15, 148)}>
        <FileRow icon={POD_FILE_ICON[pod]} name={t(key('file'))} width={PREVIEW_W} />
      </span>
      <span
        style={abs(15, 194, {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          height: 28,
          width: PREVIEW_W,
        })}
      >
        {POD_CHAT_IS_MINE[pod] ? (
          <span style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <OutBubble text={text} time={time} />
          </span>
        ) : (
          <InBubble from={t(key('memberInitial'))} text={text} time={time} />
        )}
      </span>
      <span style={abs(15, 232)}>
        <MessageField width={PREVIEW_W} />
      </span>
    </>
  )
}

// A pod's header on the card: tile, name, category and members.
const PodHeader = ({ pod, q }: { pod: PodId; q: number }) => {
  const { t } = useTranslation()
  const members = useMembers(pod)
  const key = (path: string) => `pods.tellipodIntro.living.pods.${pod}.${path}`
  return (
    <>
      <span style={abs(15, headTop(q) - 1)}>
        <PodTile pod={pod} />
      </span>
      <span style={abs(65, headTop(q) - 1)}>
        <DSText color={C.title} numberOfLines={1} size="base" weight="semibold">
          {t(key('name'))}
        </DSText>
        <CatLine icon={POD_CATEGORY_ICON[pod]} text={t(key('category'))} />
      </span>
      <span style={absRight(headPadR(q) - 1, headTop(q) + 7, { height: 24, width: 24 + 18 * (members.length - 1) })}>
        <StaticStack people={members} />
      </span>
    </>
  )
}

const DeckCard = memo(({ i, pod }: { i: number; pod: PodId }) => {
  const ref = useRef<HTMLDivElement>(null)
  const faceRef = useRef<HTMLDivElement>(null)
  useFrameStyle(ref, (iv) => {
    const q = iv.q.value
    const pose = deckPose(i, iv.s1.value * T1_V2, P1.h)
    const o = pose.o * (1 - remap(q, 0.02, 0.2))
    return {
      display: o > 0.001 ? 'flex' : 'none',
      opacity: o,
      transform: [{ translateY: pose.ty + 16 * remap(q, 0.02, 0.26) }, { scale: pose.s }],
    }
  })
  useFrameStyle(faceRef, (iv) => ({ opacity: deckFace(i, iv.s1.value * T1_V2) }))
  return (
    <div
      aria-hidden
      ref={ref}
      style={abs(P1.x, P1.y, {
        backgroundColor: C.card,
        border: `1px solid ${C.stroke}`,
        borderRadius: P1.r,
        boxShadow: CARD_SHADOW,
        boxSizing: 'border-box',
        height: P1.h,
        pointerEvents: 'none',
        width: P1.w,
      })}
    >
      <div ref={faceRef} style={{ ...FILL, borderRadius: P1.r - 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 7 }}>
          <CardHandle />
        </div>
        <PodHeader pod={pod} q={0} />
        <PreviewBody pod={pod} />
      </div>
    </div>
  )
})

// The cards below Ginger's, which the main card lands on.
export const Deck = memo(() => (
  <>
    {DECK_PODS.slice(0, DECK_N - 1).map((pod, i) => (
      <DeckCard i={i} key={pod} pod={pod} />
    ))}
  </>
))
