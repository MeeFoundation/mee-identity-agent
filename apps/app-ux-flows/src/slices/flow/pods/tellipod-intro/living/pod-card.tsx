// Ginger's pod card: it lands on the deck, opens into the pod with the Telli demo, becomes the shared pod and finally
// shrinks into a row of the pods list. Ported from the prototype's `SceneV2`; everything moves with the camera
// position `q` and the story times of beats 2 and 3.

import { useId, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useFrameStyle, useFrameValue, useIntroScene } from '../engine/frame'
import {
  BODY3_H,
  BODY3_W,
  DECK_N,
  deckPose,
  frameAt,
  headPadR,
  headTop,
  P1,
  ROW_D,
  ROW2,
  ROW3,
  rowMorph,
  STACK_BOX,
  T1_V2,
} from '../engine/living'
import { eio, eo, lerp, ph, remap, smooth } from '../engine/math'
import { T2, T3 } from '../engine/timeline'
import type { IntroValues } from '../engine/values'
import { ButtonFace } from '../overlays/button-face'
import { CardTabs } from '../overlays/card-tabs'
import { CellInfoRow } from '../overlays/cell-info-row'
import { DotBadge, DSText, Icon, LinearGradient } from '../overlays/ui'
import { light, palette } from '../scene/palette'
import { CardHandle, PreviewBody } from './deck'
import { MemberStack, SyncBadge } from './members'
import {
  abs,
  absRight,
  C,
  CARD_SHADOW,
  CatLine,
  FILL,
  FieldBox,
  FormatBar,
  InBubble,
  MessageField,
  PodTile,
  SectionLabel,
} from './parts'
import { POD_CATEGORY_ICON } from './pods'

const m2Of = (iv: IntroValues) => iv.v2.value * T2
const m3Of = (iv: IntroValues) => iv.v3.value * T3

const INNER2 = 280
const FIELD_W = BODY3_W - 28
const RING_COLOR = light['alpha-outline-brand']
const BUTTON_H = 36
const NONE = { pointerEvents: 'none' } as const
const HIDDEN = { display: 'none' } as const

// The beat-2 content: the pod's tabs, the note being written, "Invite Telli", the suggested rows' button.
const Demo = ({ onInviteTelli, onAddAll }: { onInviteTelli: () => void; onAddAll: () => void }) => {
  const { t } = useTranslation()
  const { iv, reducedMotion } = useIntroScene()
  const canInvite = useFrameValue((v) => v.canInvite.value)
  const canAddAll = useFrameValue((v) => v.canAddAll.value)
  const inviteHintId = useId()
  const addAllHintId = useId()
  const lineW = useRef(214)
  const lineTextRef = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const width = lineTextRef.current?.offsetWidth ?? 0
    if (width > 0) lineW.current = width
  })

  const rootRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const notesRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const caretRef = useRef<HTMLDivElement>(null)
  const formatRef = useRef<HTMLDivElement>(null)
  const formatFadeRef = useRef<HTMLDivElement>(null)
  const inviteRef = useRef<HTMLDivElement>(null)
  const inviteRingRef = useRef<HTMLSpanElement>(null)
  const addAllRingRef = useRef<HTMLSpanElement>(null)
  const addAllRef = useRef<HTMLDivElement>(null)

  useFrameStyle(rootRef, (v) => {
    const q = v.q.value
    const o = remap(q, 0.28, 0.66) * (1 - remap(q, 1.04, 1.26))
    const i = 1 - smooth(remap(q, 0.2, 0.9))
    return {
      display: o > 0.001 ? 'flex' : 'none',
      opacity: o,
      transform: [{ translateY: 18 * i - 10 * remap(q, 1, 1.3) }, { scale: 1 - 0.05 * i }],
    }
  })
  const scaleTabs = (v: IntroValues) => {
    const k = Math.min(1, (frameAt(v.q.value).w - 32) / INNER2)
    return { transform: [{ translateX: (-INNER2 / 2) * (1 - k) }, { translateY: -19 * (1 - k) }, { scale: k }] }
  }
  useFrameStyle(tabsRef, scaleTabs)
  useFrameStyle(formatRef, scaleTabs)
  useFrameStyle(notesRef, (v) => {
    const tt = ph(m2Of(v), 2150, 2330)
    return { opacity: 1 - tt, transform: [{ translateX: -28 * eio(tt) }] }
  })
  useFrameStyle(tagRef, (v) => ({ opacity: ph(m2Of(v), 0, 150) }))
  useFrameStyle(lineRef, (v) => ({ width: lineW.current * ph(m2Of(v), 150, 900) }))
  useFrameStyle(caretRef, (v) => {
    const m = m2Of(v)
    return {
      opacity: (m < 150 ? (Math.floor(m / 75) % 2 === 0 ? 1 : 0.25) : 1) * (1 - ph(m, 900, 1100)),
      transform: [{ translateX: lineW.current * ph(m, 150, 900) }],
    }
  })
  useFrameStyle(highlightRef, (v) => {
    const s = ph(m2Of(v), 1800, 2100)
    const w = lineW.current + 8
    return {
      opacity: s > 0.001 ? 1 : 0,
      transform: [{ translateX: -(w / 2) * (1 - s) }, { scaleX: Math.max(s, 0.001) }],
      width: w,
    }
  })
  useFrameStyle(formatFadeRef, (v) => ({ opacity: 1 - ph(m2Of(v), 2150, 2300) }))
  useFrameStyle(inviteRef, (v) => {
    const m = m2Of(v)
    const press = Math.sin(Math.PI * ph(m, 1100, 1250))
    const s =
      m < 1100 ? lerp(0.9, 1, eo(ph(m, 900, 1100))) : m < 1250 ? 1 - 0.04 * press : lerp(1, 0.92, ph(m, 1250, 1400))
    const o = ph(m, 900, 1100) * (1 - ph(m, 1250, 1400))
    return {
      display: o > 0.001 ? 'flex' : 'none',
      opacity: o,
      transform: [{ translateY: 6 * (1 - ph(m, 900, 1100)) }, { scale: s }],
    }
  })
  useFrameStyle(inviteRingRef, (v) => ({
    opacity: reducedMotion ? 0 : Math.abs(Math.sin(2 * Math.PI * v.pulseInvite.value)),
  }))
  useFrameStyle(addAllRingRef, (v) => ({
    opacity: reducedMotion ? 0 : Math.abs(Math.sin(2 * Math.PI * v.pulseAddAll.value)),
  }))
  useFrameStyle(addAllRef, (v) => {
    const m = m2Of(v)
    const press = ph(m, 2900, 2940) * (1 - ph(m, 3010, 3050))
    const o = ph(m, 2700, 2900) * (1 - ph(m, 3050, 3350))
    return {
      display: o > 0.001 ? 'flex' : 'none',
      height: BUTTON_H * (1 - eio(ph(m, 3050, 3350))),
      opacity: o,
      transform: [{ translateY: 6 * (1 - ph(m, 2700, 2900)) }, { scale: 1 - 0.04 * press }],
    }
  })

  const invitePressed = () => Math.sin(Math.PI * ph(m2Of(iv), 1100, 1250))
  const addPressed = () => {
    const m = m2Of(iv)
    return ph(m, 2900, 2940) * (1 - ph(m, 3010, 3050))
  }
  const inviteLabel = t('pods.tellipodIntro.demo.inviteTelli')
  const addAllLabel = t('pods.tellipodIntro.demo.addAll')

  return (
    <div ref={rootRef} style={{ ...abs(0, 0, { height: 324, width: 310 }), ...NONE }}>
      <div aria-hidden ref={tabsRef} style={{ ...abs(15, 77), ...NONE }}>
        <CardTabs
          index={() => 2 * eio(ph(m2Of(iv), 2150, 2420))}
          items={[
            t('pods.tellipodIntro.pod.notes'),
            t('pods.tellipodIntro.pod.chat'),
            t('pods.tellipodIntro.pod.info'),
          ]}
          width={INNER2}
        />
      </div>
      <div ref={notesRef} style={{ ...abs(0, 0, { height: 324, width: 310 }), ...NONE }}>
        <div aria-hidden style={{ ...abs(0, 0), ...NONE }}>
          <div ref={tagRef} style={abs(15, 135)}>
            <DSText color={palette['purple-700']} numberOfLines={1} size="base">
              {t('pods.tellipodIntro.pod.noteTag')}
            </DSText>
          </div>
          <div
            ref={highlightRef}
            style={abs(11, 159, {
              border: `1px solid ${palette['warning-200']}`,
              borderRadius: 6,
              boxSizing: 'border-box',
              height: 28,
              opacity: 0,
              overflow: 'hidden',
            })}
          >
            <LinearGradient colors={[palette['warning-100'], palette['brand-50']]} />
          </div>
          <div ref={lineRef} style={abs(15, 161, { height: 24, overflow: 'hidden', width: 0 })}>
            <div style={abs(0, 0, { display: 'flex', flexDirection: 'row', width: 400 })}>
              <span ref={lineTextRef}>
                <DSText color={C.body} numberOfLines={1} size="base">
                  {t('pods.tellipodIntro.pod.note')}
                </DSText>
              </span>
            </div>
          </div>
          <div ref={caretRef} style={abs(15, 163, { backgroundColor: palette['brand-700'], height: 20, width: 2 })} />
          <div ref={formatRef} style={abs(15, 270)}>
            <div ref={formatFadeRef}>
              <FormatBar width={INNER2} />
            </div>
          </div>
        </div>
        <div ref={inviteRef} style={{ ...abs(15, 205), ...HIDDEN }}>
          <span
            ref={inviteRingRef}
            style={{
              border: `3px solid ${RING_COLOR}`,
              borderRadius: 15,
              bottom: -3,
              left: -3,
              opacity: 0,
              pointerEvents: 'none',
              position: 'absolute',
              right: -3,
              top: -3,
            }}
          />
          <button
            aria-describedby={inviteHintId}
            aria-hidden={canInvite ? undefined : true}
            aria-label={inviteLabel}
            disabled={!canInvite}
            onClick={() => {
              if (iv.canInvite.value) onInviteTelli()
            }}
            style={{
              background: 'none',
              border: 0,
              cursor: canInvite ? 'pointer' : 'default',
              display: 'flex',
              padding: 0,
              pointerEvents: canInvite ? 'auto' : 'none',
            }}
            tabIndex={canInvite ? 0 : -1}
            type="button"
          >
            <ButtonFace
              iconLeft="chat-ai-lock"
              label={inviteLabel}
              pressed={invitePressed}
              size="M"
              variant="secondary"
            />
          </button>
          <span id={inviteHintId} style={HIDDEN}>
            {t('pods.tellipodIntro.demo.inviteTelliHint')}
          </span>
        </div>
      </div>
      <span
        ref={addAllRingRef}
        style={{
          border: `3px solid ${RING_COLOR}`,
          borderRadius: 15,
          boxSizing: 'border-box',
          height: 42,
          left: 12,
          opacity: 0,
          pointerEvents: 'none',
          position: 'absolute',
          top: 262,
          width: 286,
        }}
      />
      <div
        aria-hidden
        ref={addAllRef}
        style={{ ...abs(15, 265, { borderRadius: 12, overflow: 'hidden', width: INNER2 }), ...NONE, ...HIDDEN }}
      >
        <ButtonFace block iconLeft="chat-ai-lock" label={addAllLabel} pressed={addPressed} size="M" variant="primary" />
      </div>
      <button
        aria-describedby={addAllHintId}
        aria-hidden={canAddAll ? undefined : true}
        aria-label={addAllLabel}
        disabled={!canAddAll}
        onClick={() => {
          if (iv.canAddAll.value) onAddAll()
        }}
        style={{
          ...abs(15, 261, { height: 44, width: INNER2 }),
          background: 'none',
          border: 0,
          cursor: canAddAll ? 'pointer' : 'default',
          padding: 0,
          pointerEvents: canAddAll ? 'auto' : 'none',
        }}
        tabIndex={canAddAll ? 0 : -1}
        type="button"
      />
      <span id={addAllHintId} style={HIDDEN}>
        {t('pods.tellipodIntro.demo.addAllHint')}
      </span>
    </div>
  )
}

// A suggested info row on beat 2, which moves into the pod's info list as the camera moves on.
const SuggestedRow = ({ i }: { i: 0 | 1 }) => {
  const { t } = useTranslation()
  const { iv } = useIntroScene()
  const ref = useRef<HTMLDivElement>(null)
  const at = i === 0 ? 2350 : 2430
  useFrameStyle(ref, (v) => {
    const q = v.q.value
    const arrive = eo(ph(m2Of(v), at, at + 260))
    const morph = rowMorph(q)
    const o = arrive * (q <= 1 ? remap(q, 0.28, 0.66) : 1 - remap(q, 1.26, 1.44))
    const from = ROW2[i] ?? [0, 0]
    const to = ROW3[i] ?? [0, 0]
    return {
      display: o > 0.001 ? 'flex' : 'none',
      opacity: o,
      transform: [
        { translateX: lerp(from[0], to[0] + ROW_D[0], morph) },
        {
          translateY:
            lerp(from[1], to[1] + ROW_D[1], morph) + 10 * (1 - arrive) + 18 * (1 - smooth(remap(q, 0.2, 0.9))),
        },
        { scale: 0.98 + 0.02 * arrive },
      ],
    }
  })
  const label = i === 0 ? t('pods.tellipodIntro.pod.meals') : t('pods.tellipodIntro.pod.portion')
  const value = i === 0 ? t('pods.tellipodIntro.pod.mealsValue') : t('pods.tellipodIntro.pod.portionValue')
  return (
    <div aria-hidden ref={ref} style={{ ...abs(0, 0), ...NONE }}>
      <CellInfoRow
        confirm={() => ph(m2Of(iv), 3000 + 80 * i, 3200 + 80 * i)}
        divider={i === 0}
        label={label}
        suggestedLabel={t('pods.tellipodIntro.demo.suggested')}
        value={value}
        width={INNER2}
      />
    </div>
  )
}

// The shared pod's body: its info rows, "Paula joined" and Paula's message. On your phone it is the card's content from
// beat 2 on; on Paula's phone it fills in as the one-time link opens the pod.
export const SharedBody = ({ mine }: { mine: boolean }) => {
  const { t } = useTranslation()
  const labelRef = useRef<HTMLDivElement>(null)
  const row0Ref = useRef<HTMLDivElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const joinedRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)

  useFrameStyle(labelRef, (v) =>
    mine ? { opacity: remap(v.q.value, 1.36, 1.6) } : { opacity: eo(ph(m3Of(v), 1200, 1380)) },
  )
  const rowStyle = (i: 0 | 1, lit: number) => (v: IntroValues) => {
    const from = ROW2[i] ?? [0, 0]
    const to = ROW3[i] ?? [0, 0]
    if (mine) {
      const q = v.q.value
      const morph = rowMorph(q)
      return {
        opacity: q <= 2 ? remap(q, 1.26, 1.44) : 1,
        transform: [
          { translateX: lerp(from[0] - ROW_D[0], to[0], morph) },
          { translateY: lerp(from[1] - ROW_D[1], to[1], morph) },
        ],
      }
    }
    const k = eo(ph(m3Of(v), lit, lit + 180))
    return { opacity: k, transform: [{ translateX: to[0] }, { translateY: to[1] + 6 * (1 - k) }] }
  }
  useFrameStyle(row0Ref, rowStyle(0, 1200))
  useFrameStyle(row1Ref, rowStyle(1, 1270))
  useFrameStyle(chatRef, (v) => {
    if (!mine) return { opacity: 1 }
    const tt = remap(v.q.value, 1.4, 1.72)
    return { opacity: tt, transform: [{ translateY: 10 * (1 - tt) }] }
  })
  useFrameStyle(joinedRef, (v) => {
    const tt = ph(m3Of(v), 1440, 1600)
    return { opacity: tt, transform: [{ translateY: 4 * (1 - tt) }] }
  })
  useFrameStyle(bubbleRef, (v) => {
    const tt = eo(ph(m3Of(v), 1650, 1880))
    return { opacity: tt, transform: [{ translateY: 8 * (1 - tt) }, { scale: 0.9 + 0.1 * tt }] }
  })
  const rows = [
    { label: t('pods.tellipodIntro.pod.meals'), value: t('pods.tellipodIntro.pod.mealsValue') },
    { label: t('pods.tellipodIntro.pod.portion'), value: t('pods.tellipodIntro.pod.portionValue') },
  ]
  return (
    <div aria-hidden style={abs(0, 0, { height: BODY3_H, width: BODY3_W })}>
      <div ref={labelRef} style={abs(14, 73)}>
        <SectionLabel>{t('pods.tellipodIntro.pod.info')}</SectionLabel>
      </div>
      <div ref={row0Ref} style={abs(0, 0)}>
        <FieldBox label={rows[0]?.label ?? ''} value={rows[0]?.value ?? ''} width={FIELD_W} />
      </div>
      <div ref={row1Ref} style={abs(0, 0)}>
        <FieldBox label={rows[1]?.label ?? ''} value={rows[1]?.value ?? ''} width={FIELD_W} />
      </div>
      <div ref={chatRef} style={abs(0, 0, { height: BODY3_H, width: BODY3_W })}>
        <div ref={joinedRef} style={abs(14, 200, { display: 'flex', justifyContent: 'center', width: FIELD_W })}>
          <DSText color={C.ph} size="2xs">
            {t('pods.tellipodIntro.living.labels.paulaJoined')}
          </DSText>
        </div>
        <div ref={bubbleRef} style={abs(14, 218)}>
          <InBubble
            from={t('pods.tellipodIntro.pod.paulaInitial')}
            text={t('pods.tellipodIntro.pod.message')}
            time={t('pods.tellipodIntro.pod.messageTime')}
          />
        </div>
        <div style={abs(14, 256)}>
          <MessageField h={30} width={FIELD_W} />
        </div>
      </div>
    </div>
  )
}

// The header Ginger's card shows from the demo on, and that turns into a list row on the last beat.
const GingerHeader = () => {
  const { t } = useTranslation()
  const headRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const catRef = useRef<HTMLDivElement>(null)
  const lastRef = useRef<HTMLDivElement>(null)
  const chevronRef = useRef<HTMLDivElement>(null)
  const badge = useRef({ value: 0 }).current
  useFrameStyle(headRef, (v) => {
    badge.value = eo(remap(v.q.value, 2.62, 2.9))
    return { transform: [{ translateY: headTop(v.q.value) - 1 }] }
  })
  useFrameStyle(stackRef, (v) => ({
    right: headPadR(v.q.value) - 1,
    transform: [{ translateY: headTop(v.q.value) + 7 }],
  }))
  useFrameStyle(catRef, (v) => {
    const e = remap(v.q.value, 2.3, 2.5)
    return { opacity: 1 - e, transform: [{ translateY: -4 * e }] }
  })
  useFrameStyle(lastRef, (v) => {
    const e = remap(v.q.value, 2.44, 2.72)
    return { opacity: e, transform: [{ translateY: 4 * (1 - e) }] }
  })
  useFrameStyle(chevronRef, (v) => ({
    opacity: remap(v.q.value, 2.42, 2.72),
    transform: [{ translateY: headTop(v.q.value) + 11 }],
  }))
  return (
    <div aria-hidden style={{ ...FILL, ...NONE }}>
      <div ref={headRef} style={abs(0, 0, { height: 44, width: '100%' })}>
        <span style={abs(15, 0)}>
          <PodTile pod="ginger" />
        </span>
        <span style={abs(46, -3)}>
          <DotBadge scale={badge} />
        </span>
        <span style={abs(65, 0)}>
          <DSText color={C.title} numberOfLines={1} size="base" weight="semibold">
            {t('pods.tellipodIntro.living.pods.ginger.name')}
          </DSText>
          <div ref={catRef}>
            <CatLine icon={POD_CATEGORY_ICON.ginger} text={t('pods.tellipodIntro.living.pods.ginger.category')} />
          </div>
        </span>
        <div ref={lastRef} style={abs(65, 23)}>
          <span style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', gap: 4 }}>
            <DSText color={C.body} numberOfLines={1} size="xs" weight="semibold">
              {t('pods.tellipodIntro.living.labels.paulaSays')}
            </DSText>
            <DSText color={C.sub} numberOfLines={1} size="xs">
              {t('pods.tellipodIntro.pod.message')}
            </DSText>
          </span>
        </div>
      </div>
      <div ref={stackRef} style={absRight(0, 0, { height: 24, width: STACK_BOX })}>
        <MemberStack />
      </div>
      <div ref={chevronRef} style={absRight(13, 0)}>
        <Icon color={palette['gray-400']} name="chevron-right" size={16} />
      </div>
    </div>
  )
}

type CardActions = { inviteTelli: () => void; addAll: () => void }

// Ginger's card: the deck's top card, the open pod, the shared pod and the last list row.
export const PodCard = ({ actions }: { actions: CardActions }) => {
  const ref = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  useFrameStyle(ref, (v) => {
    const f = frameAt(v.q.value, m2Of(v))
    const d = deckPose(DECK_N - 1, v.s1.value * T1_V2, f.h)
    const lead = remap(v.q.value, 0, 0.1)
    return {
      borderRadius: f.r,
      height: f.h,
      left: f.x,
      opacity: Math.max(d.o, lead),
      top: f.y,
      transform: [{ translateY: d.ty * (1 - lead) }, { scale: lerp(d.s, 1, lead) }],
      width: f.w,
    }
  })
  useFrameStyle(innerRef, (v) => ({ borderRadius: frameAt(v.q.value, m2Of(v)).r - 1 }))
  useFrameStyle(handleRef, (v) => ({ opacity: 1 - remap(v.q.value, 2.1, 2.36) }))
  useFrameStyle(previewRef, (v) => {
    const q = v.q.value
    const o = 1 - remap(q, 0.1, 0.42)
    const z = smooth(remap(q, 0, 0.6))
    return {
      display: o > 0.001 ? 'flex' : 'none',
      opacity: o,
      transform: [{ translateY: 26 * z }, { scale: 1 + 0.08 * z }],
    }
  })
  useFrameStyle(bodyRef, (v) => {
    const q = v.q.value
    const o = q <= 2 ? (q < 1 ? 0 : 1) : 1 - remap(q, 2.22, 2.46)
    return {
      display: o > 0.001 ? 'flex' : 'none',
      opacity: o,
      transform: [{ translateY: -10 * smooth(remap(q, 2.1, 2.6)) }],
    }
  })
  const visibleBadge = (v: IntroValues) => remap(v.q.value, 1.8, 1.96) * (1 - remap(v.q.value, 2.02, 2.2))
  return (
    <div
      ref={ref}
      style={{
        ...abs(0, 0),
        backgroundColor: C.card,
        border: `1px solid ${C.stroke}`,
        boxShadow: CARD_SHADOW,
        boxSizing: 'border-box',
        ...NONE,
      }}
    >
      <div ref={innerRef} style={{ ...FILL, ...NONE, overflow: 'hidden' }}>
        <div
          aria-hidden
          ref={handleRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 7,
            ...NONE,
          }}
        >
          <CardHandle />
        </div>
        <div aria-hidden ref={previewRef} style={{ ...abs(0, 0, { height: P1.h - 2, width: P1.w - 2 }), ...NONE }}>
          <PreviewBody pod="ginger" />
        </div>
        <Demo onAddAll={actions.addAll} onInviteTelli={actions.inviteTelli} />
        <div ref={bodyRef} style={{ ...abs(0, 0), ...NONE }}>
          <SharedBody mine />
          <SuggestedRow i={0} />
          <SuggestedRow i={1} />
        </div>
        <GingerHeader />
      </div>
      <div style={absRight(-10, -10, NONE)}>
        <SyncBadge visible={visibleBadge} />
      </div>
    </div>
  )
}
