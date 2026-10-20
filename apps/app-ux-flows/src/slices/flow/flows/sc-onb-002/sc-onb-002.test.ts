import { describe, expect, it } from 'vitest'

import { en } from '@/app/locales/en'

import { BEATS } from '../../pods/tellipod-intro/model'
import { findFlow, listFlows } from '../../registry'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scOnb001Flow } from '../sc-onb-001/flow'
import { scOnb002Flow } from './flow'
import { familyTitleKeys } from '@/slices/home/flow-families'

// Resolves an i18next key such as `flows.scOnb002.title` against the English strings.
const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

describe('SC-ONB-002 Tellipod intro: Tap through', () => {
  it('is a registered showcase without cases, listed right after SC-ONB-001 and starting on rooms', () => {
    const flows = listFlows()
    expect(scOnb002Flow.kind).toBe('showcase')
    expect(scOnb002Flow.code).toBe('SC-ONB-002')
    expect(scOnb002Flow.initialScreen).toBe('rooms')
    expect(findFlow('sc-onb-002')).toBe(scOnb002Flow)
    expect(flows.indexOf(scOnb002Flow)).toBe(flows.indexOf(scOnb001Flow) + 1)
    expect(resolveFlow(scOnb002Flow, null).cases).toEqual([])
  })

  it('declares the same screens as SC-ONB-001, with no Figma frames', () => {
    expect(Object.keys(scOnb002Flow.screens).sort()).toEqual(Object.keys(scOnb001Flow.screens).sort())
    expect(scOnb002Flow.designFrames).toBeUndefined()
  })

  it('shares the Onboarding family with SC-ONB-001', () => {
    expect(scOnb002Flow.code?.startsWith('SC-ONB')).toBe(true)
    expect(translate(familyTitleKeys['SC-ONB'] ?? '')).toBe('Onboarding')
  })

  it('translates every key it declares', () => {
    const flow = resolveFlow(scOnb002Flow, null)
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
    const flow = resolveFlow(scOnb002Flow, null)
    for (const screenId of Object.keys(scOnb002Flow.screens) as (keyof typeof flow.notes.screens)[]) {
      expect(flow.notes.screens[screenId]?.aboutKey, screenId).toBeTruthy()
    }
    expect(flow.notes.flow.aboutKey).toBe('flows.scOnb002.description')
    expect(flow.notes.flow.questionKeys.map((key) => translate(key))).toEqual([
      'Does tapping the scene make the story more engaging than a Next button, or slower?',
      'With no Next button, is it always clear what to tap next?',
      'Tapping forward now requires the Telli demo. Is that the right trade-off against Rooms, where it is optional?',
    ])
    expect(flow.notes.screens.rooms?.questionKeys).toHaveLength(1)
    expect(flow.notes.screens['ginger-pod']?.questionKeys).toHaveLength(2)
    expect(flow.notes.screens['telli-handoff']?.questionKeys).toEqual([])
  })

  it('draws the four beats with one component that differs from SC-ONB-001’s', () => {
    const [first, ...rest] = BEATS.map((beat) => scOnb002Flow.screens[beat])
    expect(first).toBeDefined()
    for (const screen of rest) expect(screen).toBe(first)
    expect(scOnb002Flow.screens['telli-handoff']).not.toBe(first)
    expect(first).not.toBe(scOnb001Flow.screens.rooms)
  })

  it('has its own title and the tap labels and hints', () => {
    expect(en.flows.scOnb002.title).toBe('Tellipod intro: Tap through')
    expect(en.flows.scOnb002.goal).toBe(en.flows.scOnb001.goal)
    expect(en.pods.tellipodIntro.pod.invitePaula).toBe('Invite Paula')
    expect(en.pods.tellipodIntro.pod.invitePaulaHint).toBe('Shares Ginger’s pod with Paula')
    expect(en.pods.tellipodIntro.pod.home).toBe('Home')
    expect(en.pods.tellipodIntro.pod.homeHint).toBe('Back to all your pods')
    expect(en.pods.tellipodIntro.pod.gingerTagTapHint).toBe('Opens Ginger’s pod')
  })
})
