import { describe, expect, it } from 'vitest'

import { en } from '@/app/locales/en'
import { familyTitleKeys } from '@/slices/home/flow-families'

import { BEATS } from '../../pods/tellipod-intro/model'
import { findFlow, listFlows } from '../../registry'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scOnb001Flow } from '../sc-onb-001/flow'
import { scOnb002Flow } from '../sc-onb-002/flow'
import { scOnb003Flow } from './flow'

// Resolves an i18next key such as `flows.scOnb003.title` against the English strings.
const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

describe('SC-ONB-003 Tellipod intro: Living pod', () => {
  it('is a registered showcase without cases, listed right after SC-ONB-002 and starting on rooms', () => {
    const flows = listFlows()
    expect(scOnb003Flow.kind).toBe('showcase')
    expect(scOnb003Flow.code).toBe('SC-ONB-003')
    expect(scOnb003Flow.initialScreen).toBe('rooms')
    expect(findFlow('sc-onb-003')).toBe(scOnb003Flow)
    expect(flows.indexOf(scOnb003Flow)).toBe(flows.indexOf(scOnb002Flow) + 1)
    expect(resolveFlow(scOnb003Flow, null).cases).toEqual([])
  })

  it('declares the same screens as SC-ONB-001, with no Figma frames', () => {
    expect(Object.keys(scOnb003Flow.screens).sort()).toEqual(Object.keys(scOnb001Flow.screens).sort())
    expect(scOnb003Flow.designFrames).toBeUndefined()
  })

  it('shares the Onboarding family with the other intros', () => {
    expect(scOnb003Flow.code?.startsWith('SC-ONB')).toBe(true)
    expect(translate(familyTitleKeys['SC-ONB'] ?? '')).toBe('Onboarding')
  })

  it('translates every key it declares', () => {
    const flow = resolveFlow(scOnb003Flow, null)
    const keys = [
      flow.titleKey,
      flow.goalKey,
      ...Object.values(flow.hints),
      flow.notes.flow.aboutKey,
      ...flow.notes.flow.questionKeys,
      ...Object.values(flow.notes.screens).flatMap((note) => [note?.aboutKey, ...(note?.questionKeys ?? [])]),
    ]
    for (const key of keys) expect(typeof translate(key ?? ''), String(key)).toBe('string')
  })

  it('explains every screen, and asks the flow’s three questions', () => {
    const flow = resolveFlow(scOnb003Flow, null)
    for (const screenId of Object.keys(scOnb003Flow.screens) as (keyof typeof flow.notes.screens)[]) {
      expect(flow.notes.screens[screenId]?.aboutKey, screenId).toBeTruthy()
    }
    expect(flow.notes.flow.aboutKey).toBe('flows.scOnb003.description')
    expect(flow.notes.flow.questionKeys.map((key) => translate(key))).toEqual([
      'Is a flat pod card clearer than the isometric home for explaining what a pod is?',
      'Does the deck on the first beat read as "your pods", or as a stack of cards?',
      "Is it clear that the pod on Paula's phone is the same pod?",
    ])
    expect(flow.notes.screens.rooms?.questionKeys).toHaveLength(1)
    expect(flow.notes.screens['ginger-pod']?.questionKeys).toHaveLength(1)
    expect(flow.notes.screens['telli-handoff']?.questionKeys).toEqual([])
  })

  it('draws the four beats with one component that differs from the other intros’', () => {
    const [first, ...rest] = BEATS.map((beat) => scOnb003Flow.screens[beat])
    expect(first).toBeDefined()
    for (const screen of rest) expect(screen).toBe(first)
    expect(scOnb003Flow.screens['telli-handoff']).not.toBe(first)
    expect(first).not.toBe(scOnb001Flow.screens.rooms)
    expect(first).not.toBe(scOnb002Flow.screens.rooms)
  })

  it('has its own title and the first beat’s copy', () => {
    expect(en.flows.scOnb003.title).toBe('Tellipod intro: Living pod')
    expect(en.flows.scOnb003.goal).toBe(en.flows.scOnb001.goal)
    expect(en.pods.tellipodIntro.living.beats.rooms.headline).toEqual({
      accent: 'Pods',
      lead: '',
      tail: ' for every\npart of life.',
    })
    expect(en.pods.tellipodIntro.living.beats.rooms.subline).toBe('One for a trip, your kid, your cat.')
  })
})
