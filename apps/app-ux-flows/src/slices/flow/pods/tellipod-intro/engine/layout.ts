// Port of the prototype's `computeLayout` for v1 (its "next" layout): where the top bar, stage, copy, pager and
// actions sit for a screen of `W`×`H`.

import type { IntroMode } from '../model'
import { KEYS, type KeyValues } from './camera'
import { KEY_SPAN } from './living'
import { clamp, iso } from './math'
import type { Stage } from './values'

const STAGE_MAX_H = 460
const CHROME_H = 44
const TEXT_MAX_W = 370
const STAGE_FEATHER = 14
const TAP_STAGE_MAX_H = 600
const TAP_FEATHER_TOP = 110
const TAP_FEATHER_FRAC = 0.43
const TAP_SHIFT_2 = 40
// The pod card in tap mode: its tallest height, its gap to the pager side of the stage, and the gap above it.
const TAP_CARD_MAX_H = 256
export const TAP_CARD_BOTTOM = 12
const TAP_CARD_GAP = 12
// A tap-mode button's height at UI scale `ui`, in whole tenths of a point.
export const tapBtnH = (ui: number) => Math.ceil(440 / Math.min(ui, 1)) / 10
// The phone's body in the world: the corner of its rounded base, which the first beat keeps above the copy.
const PHONE_BODY = { r: 16, u1: 136, v1: 70, zBottom: -8 }

type Insets = { top: number; bottom: number }

type TypeScale = { h: number; hl: number; s: number; sl: number }

export type IntroLayout = {
  W: number
  H: number
  chrome: { y: number; h: number }
  stage: Stage
  text: { y: number; h: number }
  text4: { y: number }
  textCol: { x: number; w: number }
  pager: { y: number }
  next: { x: number; y: number; w: number; h: number }
  start: { x: number; y: number; w: number; h: number }
  links: { y: number; h: number }
  type: TypeScale
  compact: boolean
  hideStage: boolean
}

// The height the copy needs: two or three headline lines and as many subline lines.
const reservedTextH = (compact: boolean, fontScale = 1) => {
  const t = compact ? { hl: 32, sl: 24 } : { hl: 40, sl: 28 }
  const f = clamp(fontScale, 1, 2.4)
  const lines = f > 1.3 ? 3 : 2
  return (lines * t.hl + 8 + lines * t.sl) * f
}

const NO_SHIFT: KeyValues = [0, 0, 0, 0]
const FEATHER: KeyValues = [STAGE_FEATHER, STAGE_FEATHER, STAGE_FEATHER, STAGE_FEATHER]

const computeNextLayout = (
  W: number,
  H: number,
  insets: Insets,
  fontScale = 1,
  measuredTextH?: number,
): IntroLayout => {
  const top = insets.top > 0 ? insets.top : 16
  const compact = H < 740
  const type: TypeScale = compact ? { h: 24, hl: 32, s: 16, sl: 24 } : { h: 30, hl: 40, s: 18, sl: 28 }
  const linksBottom = H - Math.max(insets.bottom + 10, 16)
  const pager = { y: H - Math.max(insets.bottom + 6, 18) - 6 }
  const next = { h: 56, w: W - 32, x: 16, y: pager.y - (compact ? 14 : 18) - 56 }
  const textH = Math.max(reservedTextH(compact, fontScale), measuredTextH ?? 0)
  const text = { h: textH, y: next.y - (compact ? 20 : 26) - textH }
  const links = { h: 88, y: linksBottom - 88 }
  const start = { h: 56, w: W - 32, x: 16, y: links.y - 8 - 56 }
  const text4 = { y: start.y - (compact ? 20 : 28) - textH }
  const room = text.y - 12 - (top + CHROME_H)
  const stageH = Math.max(0, Math.min(STAGE_MAX_H, room))
  const padTop = Math.max(0, room - stageH)
  const chrome = { h: CHROME_H, y: top + padTop }
  const ui = clamp(Math.min((stageH - 8) / 292, W / 402), 0.7, 1)
  // On the last beat the copy sits higher, so the home is framed above it.
  const endInset = Math.max(0, Math.min(text.y - text4.y, stageH / 2))
  const stage: Stage = {
    compact,
    endInset,
    featherTop: FEATHER,
    h: stageH,
    keyInsets: [0, 0, 0, endInset],
    keyShift: NO_SHIFT,
    stageCompact: stageH < 300,
    ui,
    w: W,
    x: 0,
    y: chrome.y + CHROME_H,
  }
  const hideStage = stageH < 180
  const colW = Math.min(W - 32, TEXT_MAX_W)
  return {
    chrome,
    compact,
    H,
    hideStage,
    links,
    next,
    pager,
    stage,
    start,
    text,
    text4: hideStage ? { y: text.y } : text4,
    textCol: { w: colW, x: (W - colW) / 2 },
    type,
    W,
  }
}

// Tap mode: the copy sits under the top bar, the stage takes the rest down to the pager, and the pod card docks at the
// bottom of the stage. Falls back to the next layout when the stage would be too short.
const computeTapLayout = (
  W: number,
  H: number,
  insets: Insets,
  fontScale: number,
  measuredTextH: number | undefined,
  firstTextH: number | undefined,
): IntroLayout => {
  const top = insets.top > 0 ? insets.top : 16
  const compact = H < 740
  const type: TypeScale = compact ? { h: 24, hl: 32, s: 16, sl: 24 } : { h: 30, hl: 40, s: 18, sl: 28 }
  const linksBottom = H - Math.max(insets.bottom + 10, 16)
  const pager = { y: H - Math.max(insets.bottom + 6, 18) - 6 }
  const links = { h: 88, y: linksBottom - 88 }
  const start = { h: 56, w: W - 32, x: 16, y: links.y - 8 - 56 }
  const textH = Math.max(reservedTextH(compact, fontScale), measuredTextH ?? 0)
  const textGap = compact ? 6 : 12
  const stageBottom = pager.y - (compact ? 10 : 12)
  const room = stageBottom - (top + CHROME_H + textGap + textH + (compact ? 10 : 16))
  if (room < 180) return computeNextLayout(W, H, insets, fontScale, measuredTextH)
  const stageH = Math.min(TAP_STAGE_MAX_H, room)
  const padTop = room - stageH
  const chrome = { h: CHROME_H, y: top }
  const text = { h: textH, y: top + CHROME_H + padTop + textGap }
  const stageY = stageBottom - stageH
  const ui = clamp(Math.min((stageH - 8) / 292, W / 402), 0.7, 1)
  const cardInset = Math.min((TAP_CARD_MAX_H + TAP_CARD_BOTTOM + TAP_CARD_GAP) * ui, Math.max(0, stageH - 160))
  const endInset = Math.max(0, Math.min(stageBottom - (start.y - 16), stageH / 2))
  // Beat 1 frames the home between the Kyoto tag and the phone's base, centred on the gap below the copy.
  const k0 = KEYS[0] ?? { h: 260, w: 376, x: 201, y: 180 }
  const k1 = KEYS[1] ?? k0
  const z0 = Math.min(W / k0.w, stageH / k0.h)
  const baseY = iso(
    PHONE_BODY.u1 - PHONE_BODY.r + PHONE_BODY.r * Math.SQRT1_2,
    PHONE_BODY.v1 - PHONE_BODY.r + PHONE_BODY.r * Math.SQRT1_2,
    PHONE_BODY.zBottom,
  )[1]
  const tagY = stageH / 2 + ((iso(-62, -62, 68)[1] - k0.y) * z0 - 28 * ui)
  const baseScreenY = stageH / 2 + (baseY - k0.y) * z0
  const centreY = (text.y + (firstTextH ?? textH) - (type.sl - type.s) / 2 - stageY + (pager.y - stageY)) / 2
  const inset0 = Math.min(2 * ((tagY + baseScreenY) / 2 - centreY), stageH - k0.h * z0)
  // Beat 2 frames Ginger's room above the pod card.
  const framed = stageH - cardInset
  const z1 = Math.min(W / k1.w, framed / k1.h)
  const roomY = framed / 2 + (iso(44, -42, 0)[1] - k1.y) * z1
  const shift2 = clamp(stageH - (TAP_CARD_MAX_H + TAP_CARD_BOTTOM + 24) * ui - roomY, 0, TAP_SHIFT_2 * ui)
  const featherTop = Math.max(STAGE_FEATHER, Math.min(TAP_FEATHER_TOP * ui, TAP_FEATHER_FRAC * framed))
  const stage: Stage = {
    compact,
    endInset,
    featherTop: [STAGE_FEATHER, featherTop, STAGE_FEATHER, STAGE_FEATHER],
    h: stageH,
    keyInsets: [inset0, cardInset, 0, endInset],
    keyShift: [0, shift2, 0, 0],
    stageCompact: stageH < 300,
    ui,
    w: W,
    x: 0,
    y: stageY,
  }
  const colW = Math.min(W - 32, TEXT_MAX_W)
  return {
    chrome,
    compact,
    H,
    hideStage: false,
    links,
    next: start,
    pager,
    stage,
    start,
    text,
    text4: { y: text.y },
    textCol: { w: colW, x: (W - colW) / 2 },
    type,
    W,
  }
}

// Living mode: the copy sits under the top bar like in tap mode, and the stage takes the space from the copy down to the
// Next button, with each beat's own box inside it. Falls back to the next layout when a beat's box would be too short
// for its content.
const computeLivingLayout = (
  W: number,
  H: number,
  insets: Insets,
  fontScale: number,
  measuredTextH: number | undefined,
  firstTextH: number | undefined,
): IntroLayout => {
  const top = insets.top > 0 ? insets.top : 16
  const compact = H < 740
  const type: TypeScale = compact ? { h: 24, hl: 32, s: 16, sl: 24 } : { h: 30, hl: 40, s: 18, sl: 28 }
  const linksBottom = H - Math.max(insets.bottom + 10, 16)
  const pager = { y: H - Math.max(insets.bottom + 6, 18) - 6 }
  const next = { h: 56, w: W - 32, x: 16, y: pager.y - (compact ? 14 : 18) - 56 }
  const links = { h: 88, y: linksBottom - 88 }
  const start = { h: 56, w: W - 32, x: 16, y: links.y - 8 - 56 }
  const textH = Math.max(reservedTextH(compact, fontScale), measuredTextH ?? 0)
  const chrome = { h: CHROME_H, y: top }
  const text = { h: textH, y: top + CHROME_H + (compact ? 6 : 12) }
  const descender = (type.sl - type.s) / 2
  const firstBottom = text.y + Math.min(firstTextH ?? textH, textH) - descender
  const fullBottom = text.y + textH - descender
  const stageY = Math.round(firstBottom)
  const stageH = next.y - stageY
  const room = [next.y - firstBottom, next.y - fullBottom, next.y - fullBottom, start.y - fullBottom]
  if (room.some((r, i) => r < 0.5 * ((KEY_SPAN[i]?.[1] ?? 0) - (KEY_SPAN[i]?.[0] ?? 0)) + 24))
    return computeNextLayout(W, H, insets, fontScale, measuredTextH)
  const ui = clamp(Math.min((stageH - 8) / 292, W / 402), 0.7, 1)
  const rel = (a: number, b: number): readonly [number, number] => [a - stageY, b - stageY]
  const stage: Stage = {
    compact,
    endInset: 0,
    featherTop: FEATHER,
    h: stageH,
    keyBox: [rel(firstBottom, next.y), rel(fullBottom, next.y), rel(fullBottom, next.y), rel(fullBottom, start.y)],
    keyInsets: NO_SHIFT,
    keyShift: NO_SHIFT,
    stageCompact: stageH < 300,
    ui,
    w: W,
    x: 0,
    y: stageY,
  }
  const colW = Math.min(W - 32, TEXT_MAX_W)
  return {
    chrome,
    compact,
    H,
    hideStage: false,
    links,
    next,
    pager,
    stage,
    start,
    text,
    text4: { y: text.y },
    textCol: { w: colW, x: (W - colW) / 2 },
    type,
    W,
  }
}

export const computeLayout = (
  W: number,
  H: number,
  insets: Insets,
  fontScale = 1,
  measuredTextH?: number,
  mode: IntroMode = 'next',
  firstTextH?: number,
): IntroLayout =>
  mode === 'tap'
    ? computeTapLayout(W, H, insets, fontScale, measuredTextH, firstTextH)
    : mode === 'living'
      ? computeLivingLayout(W, H, insets, fontScale, measuredTextH, firstTextH)
      : computeNextLayout(W, H, insets, fontScale, measuredTextH)
