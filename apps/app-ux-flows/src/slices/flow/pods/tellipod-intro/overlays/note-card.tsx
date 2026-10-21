// Port of the prototype's `NoteCard`: Ginger's pod card. It grows out of the paper on Ginger's desk, writes the note,
// offers "Invite Telli", turns to Info as Telli's suggestions arrive, and folds "Add all suggested info" away once the
// rows are confirmed. In tap mode the card is full width and docked at the bottom of the stage, its buttons are ringed,
// and "Invite Paula" takes the place of "Add all". Everything moves with beat 2's story time `m2`.

import { useId, useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { w2s } from '../engine/camera'
import { useFrameStyle, useFrameValue, useIntroScene } from '../engine/frame'
import { TAP_CARD_BOTTOM, tapBtnH } from '../engine/layout'
import { eio, eo, lerp, ph } from '../engine/math'
import { T2 } from '../engine/timeline'
import type { IntroValues } from '../engine/values'
import { light, palette } from '../scene/palette'
import { DESK_PAPER, place, placeTransform } from './anchors'
import { AttentionRing } from './attention-ring'
import { ButtonFace } from './button-face'
import { CardTabs } from './card-tabs'
import { CellInfoRow } from './cell-info-row'
import { DSText, hitTarget, LinearGradient } from './ui'

const CARD_W = 258
const RING_COLOR = '#4f868e66'
const ADD_ALL_TOP = 200
const H_NOTES0 = 144
const H_INFO0 = 212
const H_DONE = 204
// Height of the card's buttons (size M).
const BUTTON_H = 36
// Width of the note line until it is measured.
const LINE_W0 = 214
const INVITE_W = 126
const INVITE_W_TAP = 150

// The card's height: the Notes tab, growing to the Info tab, then (outside tap mode) shrinking once "Add all" has
// folded away.
const cardHeight = (m2: number, tap: boolean, bh: number) => {
  const h = lerp(H_NOTES0 + bh, H_INFO0 + bh, eo(ph(m2, 2150, 2450)))
  return tap ? h : lerp(h, H_DONE, eio(ph(m2, 3050, 3350)))
}

const m2Of = (iv: IntroValues) => iv.v2.value * T2

const hiddenStyle = { display: 'none' } as const

type NoteCardProps = {
  onInviteTelli: () => void
  onAddAll: () => void
  onInvitePaula: () => void
}

export const NoteCard = ({ onInviteTelli, onAddAll, onInvitePaula }: NoteCardProps) => {
  const { t } = useTranslation()
  const { iv, stage, reducedMotion, tap } = useIntroScene()
  const ui = stage.ui
  const cardW = tap ? Math.max(CARD_W, stage.w / ui - 32) : CARD_W
  const contentW = cardW - 24
  const bh = tap ? tapBtnH(ui) : BUTTON_H
  const buttonSize = tap ? 'L' : 'M'
  const lineW = useRef(LINE_W0)
  const lineTextRef = useRef<HTMLSpanElement>(null)
  const inviteHintId = useId()
  const addAllHintId = useId()
  const invitePaulaHintId = useId()

  const canInvite = useFrameValue((v) => v.canInvite.value)
  const canAddAll = useFrameValue((v) => v.canAddAll.value)
  const canInvitePaula = useFrameValue((v) => tap && v.canInvitePaula.value)

  useLayoutEffect(() => {
    const width = lineTextRef.current?.offsetWidth ?? 0
    if (width > 0) lineW.current = width
  })

  const cardRef = useRef<HTMLDivElement>(null)
  const notesRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const caretRef = useRef<HTMLDivElement>(null)
  const inviteRef = useRef<HTMLDivElement>(null)
  const inviteRingRef = useRef<HTMLDivElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)
  const addAllRingRef = useRef<HTMLDivElement>(null)
  const addAllRef = useRef<HTMLDivElement>(null)
  const invitePaulaRef = useRef<HTMLDivElement>(null)

  useFrameStyle(cardRef, (v) => {
    const cw = v.cardW.value
    const d = w2s(DESK_PAPER, v.cam.value, stage.w, stage.h)
    const h = cardHeight(m2Of(v), tap, bh)
    const x = lerp(d[0], 16 * ui, cw)
    const y = lerp(d[1], tap ? stage.h - (TAP_CARD_BOTTOM + h) * ui : 52 * ui, cw)
    const s = lerp(0.12, 1, cw) * ui
    return {
      display: cw > 0.001 ? 'flex' : 'none',
      height: h,
      opacity: Math.min(1, cw * 5),
      transform: placeTransform(place(x, y, 0, 0, cardW, h, s)),
    }
  })
  useFrameStyle(notesRef, (v) => ({ opacity: 1 - ph(m2Of(v), 2150, 2300) }))
  useFrameStyle(tagRef, (v) => ({ opacity: ph(m2Of(v), 0, 150) }))
  useFrameStyle(lineRef, (v) => ({ width: lineW.current * ph(m2Of(v), 150, 900) }))
  useFrameStyle(caretRef, (v) => {
    const m = m2Of(v)
    return { opacity: 1 - ph(m, 900, 1100), transform: [{ translateX: lineW.current * ph(m, 150, 900) }] }
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
  useFrameStyle(inviteRef, (v) => {
    const m = m2Of(v)
    const invitePress = Math.sin(Math.PI * ph(m, 1100, 1250))
    const s =
      m < 1100 ? lerp(0.9, 1, ph(m, 900, 1100)) : m < 1250 ? 1 - 0.04 * invitePress : lerp(1, 0.9, ph(m, 1250, 1400))
    const o = ph(m, 900, 1100) * (1 - ph(m, 1250, 1400))
    return { display: o > 0.001 ? 'flex' : 'none', opacity: o, transform: [{ scale: s }] }
  })
  useFrameStyle(inviteRingRef, (v) => ({
    opacity: reducedMotion ? 0 : Math.abs(Math.sin(2 * Math.PI * v.pulseInvite.value)),
  }))
  useFrameStyle(row1Ref, (v) => {
    const a = ph(m2Of(v), 2350, 2600)
    return { opacity: a, transform: [{ translateY: 8 * (1 - a) }] }
  })
  useFrameStyle(row2Ref, (v) => {
    const a = ph(m2Of(v), 2430, 2680)
    return { opacity: a, transform: [{ translateY: 8 * (1 - a) }] }
  })
  useFrameStyle(addAllRef, (v) => {
    const m = m2Of(v)
    const addPress = ph(m, 2900, 2940) * (1 - ph(m, 3010, 3050))
    const o = ph(m, 2700, 2900) * (1 - ph(m, 3050, 3350))
    return {
      display: o > 0.001 ? 'flex' : 'none',
      height: bh * (1 - eio(ph(m, 3050, 3350))),
      opacity: o,
      transform: [{ translateY: 6 * (1 - ph(m, 2700, 2900)) }, { scale: 1 - 0.04 * addPress }],
    }
  })
  useFrameStyle(addAllRingRef, (v) => ({
    opacity: reducedMotion ? 0 : Math.abs(Math.sin(2 * Math.PI * v.pulseAddAll.value)),
  }))
  useFrameStyle(invitePaulaRef, (v) => {
    const a = tap ? ph(m2Of(v), 3150, 3400) : 0
    return { display: a > 0.001 ? 'flex' : 'none', opacity: a, transform: [{ translateY: 8 * (1 - eo(a)) }] }
  })

  const tabIndex = () => 2 * eio(ph(m2Of(iv), 2150, 2400))
  const invitePressed = () => Math.sin(Math.PI * ph(m2Of(iv), 1100, 1250))
  const addPressed = () => {
    const m = m2Of(iv)
    return ph(m, 2900, 2940) * (1 - ph(m, 3010, 3050))
  }
  const confirmMeals = () => ph(m2Of(iv), 3000, 3200)
  const confirmPortion = () => ph(m2Of(iv), 3080, 3280)

  const inviteHit = hitTarget(tap ? INVITE_W_TAP : INVITE_W, bh, ui)
  // The same 44 px touch target as `hitTarget`, as offsets for the invisible "Add all" button.
  const addAllPadX = Math.max(0, (44 / ui - contentW) / 2)
  const addAllPadY = Math.max(0, (44 / ui - bh) / 2)
  const invitePaulaHit = hitTarget(contentW, bh, ui)
  const inviteLabel = t('pods.tellipodIntro.demo.inviteTelli')
  const addAllLabel = t('pods.tellipodIntro.demo.addAll')

  return (
    <div ref={cardRef} style={{ left: 0, pointerEvents: 'none', position: 'absolute', top: 0, width: cardW }}>
      <div
        aria-hidden
        style={{
          backgroundColor: light['surface-default-main'],
          borderRadius: 16,
          boxShadow: '0px 1px 20px 0px #0206170d, 0px 0px 0px 1px #0206170d',
          inset: 0,
          position: 'absolute',
        }}
      />
      <div style={{ borderRadius: 16, inset: 0, overflow: 'hidden', position: 'absolute' }}>
        <div aria-hidden style={{ left: 12, position: 'absolute', top: 12 }}>
          <CardTabs
            index={tabIndex}
            items={[
              t('pods.tellipodIntro.pod.notes'),
              t('pods.tellipodIntro.pod.chat'),
              t('pods.tellipodIntro.pod.info'),
            ]}
            width={contentW}
          />
        </div>
        <div ref={notesRef} style={{ height: 144 + bh, left: 0, position: 'absolute', top: 0, width: cardW }}>
          <div aria-hidden style={{ left: 0, position: 'absolute', top: 0 }}>
            <div ref={tagRef} style={{ left: 12, position: 'absolute', top: 68 }}>
              <DSText color={palette['purple-700']} numberOfLines={1} size="base">
                {t('pods.tellipodIntro.pod.noteTag')}
              </DSText>
            </div>
            <div
              ref={highlightRef}
              style={{
                border: `1px solid ${palette['warning-200']}`,
                borderRadius: 6,
                boxSizing: 'border-box',
                height: 28,
                left: 8,
                opacity: 0,
                overflow: 'hidden',
                position: 'absolute',
                top: 94,
              }}
            >
              <LinearGradient colors={[palette['warning-100'], palette['brand-50']]} />
            </div>
            <div
              ref={lineRef}
              style={{ height: 24, left: 12, overflow: 'hidden', position: 'absolute', top: 96, width: 0 }}
            >
              <div style={{ display: 'flex', flexDirection: 'row', left: 0, position: 'absolute', top: 0, width: 400 }}>
                <span ref={lineTextRef}>
                  <DSText color={light['text-default-body']} numberOfLines={1} size="base">
                    {t('pods.tellipodIntro.pod.note')}
                  </DSText>
                </span>
              </div>
            </div>
            <div
              ref={caretRef}
              style={{
                backgroundColor: palette['brand-700'],
                height: 20,
                left: 12,
                position: 'absolute',
                top: 98,
                width: 2,
              }}
            />
          </div>
          <div ref={inviteRef} style={{ ...hiddenStyle, left: 12, position: 'absolute', top: 132 }}>
            {tap ? (
              <AttentionRing live={(v) => v.canInvite.value} radius={12} room={12} scale={ui} />
            ) : (
              <div
                ref={inviteRingRef}
                style={{
                  border: `3px solid ${RING_COLOR}`,
                  borderRadius: 15,
                  inset: -3,
                  opacity: 0,
                  pointerEvents: 'none',
                  position: 'absolute',
                }}
              />
            )}
            <button
              aria-describedby={inviteHintId}
              aria-hidden={canInvite ? undefined : true}
              aria-label={inviteLabel}
              disabled={!canInvite}
              onClick={() => {
                if (iv.canInvite.value) onInviteTelli()
              }}
              style={{
                ...inviteHit,
                background: 'none',
                border: 0,
                cursor: canInvite ? 'pointer' : 'default',
                display: 'flex',
                pointerEvents: canInvite ? 'auto' : 'none',
              }}
              tabIndex={canInvite ? 0 : -1}
              type="button"
            >
              <ButtonFace
                height={bh}
                iconLeft="chat-ai-lock"
                label={inviteLabel}
                pressed={invitePressed}
                size={buttonSize}
                variant="secondary"
              />
            </button>
            <span id={inviteHintId} style={hiddenStyle}>
              {t('pods.tellipodIntro.demo.inviteTelliHint')}
            </span>
          </div>
        </div>
        <div aria-hidden ref={row1Ref} style={{ left: 12, opacity: 0, position: 'absolute', top: 68 }}>
          <CellInfoRow
            confirm={confirmMeals}
            divider
            label={t('pods.tellipodIntro.pod.meals')}
            suggestedLabel={t('pods.tellipodIntro.demo.suggested')}
            value={t('pods.tellipodIntro.pod.mealsValue')}
            width={contentW}
          />
        </div>
        <div aria-hidden ref={row2Ref} style={{ left: 12, opacity: 0, position: 'absolute', top: 130 }}>
          <CellInfoRow
            confirm={confirmPortion}
            label={t('pods.tellipodIntro.pod.portion')}
            suggestedLabel={t('pods.tellipodIntro.demo.suggested')}
            value={t('pods.tellipodIntro.pod.portionValue')}
            width={contentW}
          />
        </div>
        {tap ? (
          <div
            style={{
              height: bh,
              left: 12,
              pointerEvents: 'none',
              position: 'absolute',
              top: ADD_ALL_TOP,
              width: contentW,
            }}
          >
            <AttentionRing live={(v) => v.canAddAll.value} radius={12} room={12} scale={ui} />
          </div>
        ) : (
          <div
            ref={addAllRingRef}
            style={{
              border: `3px solid ${RING_COLOR}`,
              borderRadius: 15,
              boxSizing: 'border-box',
              height: 42,
              left: 9,
              opacity: 0,
              pointerEvents: 'none',
              position: 'absolute',
              top: 197,
              width: contentW + 6,
            }}
          />
        )}
        <div
          aria-hidden
          ref={addAllRef}
          style={{
            ...hiddenStyle,
            borderRadius: 12,
            left: 12,
            overflow: 'hidden',
            pointerEvents: 'none',
            position: 'absolute',
            top: ADD_ALL_TOP,
            width: contentW,
          }}
        >
          <ButtonFace
            block
            height={bh}
            iconLeft="chat-ai-lock"
            label={addAllLabel}
            pressed={addPressed}
            size={buttonSize}
            variant="primary"
          />
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
            background: 'none',
            border: 0,
            cursor: canAddAll ? 'pointer' : 'default',
            height: bh + 2 * addAllPadY,
            left: 12 - addAllPadX,
            padding: 0,
            pointerEvents: canAddAll ? 'auto' : 'none',
            position: 'absolute',
            top: ADD_ALL_TOP - addAllPadY,
            width: contentW + 2 * addAllPadX,
          }}
          tabIndex={canAddAll ? 0 : -1}
          type="button"
        />
        <span id={addAllHintId} style={hiddenStyle}>
          {t('pods.tellipodIntro.demo.addAllHint')}
        </span>
        {tap ? (
          <div
            ref={invitePaulaRef}
            style={{ ...hiddenStyle, left: 12, position: 'absolute', top: ADD_ALL_TOP, width: contentW }}
          >
            <AttentionRing live={(v) => v.canInvitePaula.value} radius={12} room={12} scale={ui} />
            <button
              aria-describedby={invitePaulaHintId}
              aria-hidden={canInvitePaula ? undefined : true}
              aria-label={t('pods.tellipodIntro.pod.invitePaula')}
              disabled={!canInvitePaula}
              onClick={() => {
                if (iv.canInvitePaula.value) onInvitePaula()
              }}
              style={{
                ...invitePaulaHit,
                background: 'none',
                border: 0,
                boxSizing: 'content-box',
                cursor: canInvitePaula ? 'pointer' : 'default',
                display: 'flex',
                pointerEvents: canInvitePaula ? 'auto' : 'none',
                width: contentW,
              }}
              tabIndex={canInvitePaula ? 0 : -1}
              type="button"
            >
              <ButtonFace
                block
                height={bh}
                iconLeft="person-plus"
                label={t('pods.tellipodIntro.pod.invitePaula')}
                size="L"
                variant="secondary"
              />
            </button>
            <span id={invitePaulaHintId} style={hiddenStyle}>
              {t('pods.tellipodIntro.pod.invitePaulaHint')}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
