import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { en } from '@/app/locales/en'

import { findFlow, listFlows } from '../../registry'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scPpl003Flow } from './flow'
import { chatAtom, goalAtom, scheduleReply, sendMessageAtom, TELLI_DELAY_MS, telliTypingAtom } from './model'

// Resolves an i18next key such as `flows.scPpl003.title` against the English strings.
const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

const caseRun = (caseId: string) => resolveFlow(scPpl003Flow, null, caseId).createStore()

type Store = ReturnType<typeof caseRun>

const lastMessage = (store: Store) => store.get(chatAtom).at(-1)

// Sends as the chat screen does: the message first, then Telli's answer on a timer.
const send = (store: Store, text: string, onAnswer = vi.fn()) => {
  store.set(sendMessageAtom, text, new Date())
  scheduleReply(store, text, onAnswer)
  return onAnswer
}

describe('SC-PPL-003 Sofia’s pod, shared with me', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is a registered showcase with two cases, listed after SC-PPL-002 and starting on the notes', () => {
    expect(scPpl003Flow.kind).toBe('showcase')
    expect(scPpl003Flow.code).toBe('SC-PPL-003')
    expect(scPpl003Flow.initialScreen).toBe('notes')
    expect(findFlow('sc-ppl-003')).toBe(scPpl003Flow)
    expect(listFlows().at(-6)).toBe(scPpl003Flow)
    expect(listFlows().at(-7)?.id).toBe('sc-ppl-002')
    expect(resolveFlow(scPpl003Flow, null).cases.map(({ id, code }) => [id, code])).toEqual([
      ['a', 'SC-PPL-003-A'],
      ['b', 'SC-PPL-003-B'],
    ])
  })

  it('declares its screens and the Figma frames they implement', () => {
    expect(Object.keys(scPpl003Flow.screens).sort()).toEqual(['chat', 'contact-info', 'info', 'members', 'notes'])
    expect(
      Object.fromEntries(Object.entries(scPpl003Flow.designFrames ?? {}).map(([id, frame]) => [id, frame?.name])),
    ).toEqual({
      chat: 'SC-PPL-003-B - Chat',
      'contact-info': 'SC-PPL-003-A - Contact info',
      info: 'SC-PPL-003-A - About Sofia (info)',
      members: 'SC-PPL-003-A - Members',
      notes: 'SC-PPL-003-A - About Sofia (notes)',
    })
  })

  it('translates every key it declares', () => {
    const resolved = ['a', 'b'].map((caseId) => resolveFlow(scPpl003Flow, null, caseId))
    const keys = resolved.flatMap((flow) => [
      flow.titleKey,
      flow.descriptionKey,
      flow.goalKey,
      flow.caseNameKey,
      ...Object.values(flow.hints),
      ...flow.notes.flow.questionKeys,
      flow.notes.case?.aboutKey,
      ...Object.values(flow.notes.screens).flatMap((note) => [note?.aboutKey, ...(note?.questionKeys ?? [])]),
    ])
    for (const key of keys) expect(typeof translate(key ?? ''), String(key)).toBe('string')
  })

  it('explains the chat with one question', () => {
    const chat = resolveFlow(scPpl003Flow, null, 'b').notes.screens.chat
    expect(chat?.aboutKey).toBe('flows.scPpl003.screens.chat.about')
    expect(chat?.questionKeys).toHaveLength(1)
  })

  it('gives each case its own goal', () => {
    expect(caseRun('a').get(goalAtom)).toBe('members')
    expect(caseRun('b').get(goalAtom)).toBe('telli')
  })

  it("starts the chat with yesterday's messages and Geo joining", () => {
    expect(
      caseRun('b')
        .get(chatAtom)
        .map((entry) => (entry.kind === 'message' ? `${entry.author}:${entry.sentAt.getHours()}` : entry.kind)),
    ).toEqual(['day', 'bogdan:18', 'joined', 'bogdan:18'])
  })

  it('shows Telli typing for about a second, then the answer from the notes', () => {
    const store = caseRun('b')
    const onAnswer = send(store, 'When does Sofia have piano?')
    expect(lastMessage(store)).toMatchObject({ author: 'me', text: 'When does Sofia have piano?' })
    expect(store.get(telliTypingAtom)).toBe(true)

    vi.advanceTimersByTime(TELLI_DELAY_MS)
    expect(store.get(telliTypingAtom)).toBe(false)
    expect(lastMessage(store)).toMatchObject({ author: 'telli', textKey: 'pods.people.telli.answers.piano' })
    expect(onAnswer).toHaveBeenCalledWith(true)
  })

  it("says when it can't find something, which does not count as an answer from the pod", () => {
    const store = caseRun('b')
    const onAnswer = send(store, "What's her favourite food?")
    vi.advanceTimersByTime(TELLI_DELAY_MS)
    expect(lastMessage(store)).toMatchObject({ author: 'telli', textKey: 'pods.people.telli.answers.notFound' })
    expect(onAnswer).toHaveBeenCalledWith(false)
  })

  it('stays out of messages to people', () => {
    const store = caseRun('b')
    const onAnswer = send(store, 'Thanks!')
    expect(store.get(telliTypingAtom)).toBe(false)
    vi.advanceTimersByTime(TELLI_DELAY_MS * 2)
    expect(lastMessage(store)).toMatchObject({ author: 'me', text: 'Thanks!' })
    expect(onAnswer).not.toHaveBeenCalled()
  })
})
