export const EXAMPLE_INTERVAL_MS = 5600

export const exampleIndexAt = (elapsedMs: number, count: number) => Math.floor(elapsedMs / EXAMPLE_INTERVAL_MS) % count

export const OLD_VET = '555-0142'
export const NEW_VET = '555-0199'

export type ShareStep = 'yours' | 'sending' | 'notified' | 'opened' | 'erasing' | 'typing' | 'updating' | 'synced'

export type ShareState = {
  number: string
  step: ShareStep
}

const buildShareMarks = () => {
  const marks: { at: number; number: string; step: ShareStep }[] = []
  let at = 0
  const push = (step: ShareStep, number: string, delta = 0) => {
    at += delta
    marks.push({ at, number, step })
  }
  push('yours', OLD_VET)
  push('sending', OLD_VET, 1600)
  push('notified', OLD_VET, 1200)
  push('opened', OLD_VET, 2200)
  push('erasing', OLD_VET, 1800)
  for (let index = OLD_VET.length - 1; index >= 6; index -= 1) {
    push('erasing', OLD_VET.slice(0, index), 170)
  }
  push('typing', OLD_VET.slice(0, 6), 170)
  for (let index = 7; index <= NEW_VET.length; index += 1) {
    push('typing', NEW_VET.slice(0, index), 238)
  }
  push('updating', NEW_VET, 500)
  push('synced', NEW_VET, 1600)
  return { loopMs: at + 3400, marks, syncedAt: at }
}

const SHARE = buildShareMarks()

export const SHARE_SYNCED_MS = SHARE.syncedAt

export const shareStateAt = (elapsedMs: number, reducedMotion: boolean): ShareState => {
  if (reducedMotion) return { number: NEW_VET, step: 'synced' }
  const t = elapsedMs % SHARE.loopMs
  let current = SHARE.marks[0]
  for (const mark of SHARE.marks) {
    if (t >= mark.at) current = mark
  }
  return { number: current?.number ?? NEW_VET, step: current?.step ?? 'synced' }
}

export const BEAT3_LINE_DELAYS_MS = [300, 780, 1260, 1740] as const
export const BEAT3_DIM_MS = 2720
export const BEAT3_CLOSE_MS = 2870

export type Beat3State = {
  closingVisible: boolean
  dimmed: boolean
  visibleLines: number
}

export const beat3StateAt = (elapsedMs: number, reducedMotion: boolean): Beat3State => {
  if (reducedMotion) return { closingVisible: true, dimmed: true, visibleLines: 4 }
  return {
    closingVisible: elapsedMs >= BEAT3_CLOSE_MS,
    dimmed: elapsedMs >= BEAT3_DIM_MS,
    visibleLines: BEAT3_LINE_DELAYS_MS.filter((delay) => elapsedMs >= delay).length,
  }
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
