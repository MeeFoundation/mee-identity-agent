import { describe, expect, it } from 'vitest'

import { en } from '@/app/locales/en'

import { BEATS } from '../../pods/tellipod-intro/model'
import { findFlow, listFlows } from '../../registry'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scOnb001Flow } from './flow'
import { familyTitleKeys } from '@/slices/home/flow-families'

// Resolves an i18next key such as `flows.scOnb001.title` against the English strings.
const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

const strings = en.flows.scOnb001
const intro = en.pods.tellipodIntro

describe('SC-ONB-001 Tellipod intro: Rooms', () => {
  it('is a registered showcase without cases, listed before SC-ONB-002 and starting on rooms', () => {
    expect(scOnb001Flow.kind).toBe('showcase')
    expect(scOnb001Flow.code).toBe('SC-ONB-001')
    expect(scOnb001Flow.initialScreen).toBe('rooms')
    expect(findFlow('sc-onb-001')).toBe(scOnb001Flow)
    expect(listFlows().at(-4)).toBe(scOnb001Flow)
    expect(resolveFlow(scOnb001Flow, null).cases).toEqual([])
  })

  it('declares the four beats and three stand-ins, with no Figma frames', () => {
    expect(Object.keys(scOnb001Flow.screens).sort()).toEqual(
      ['existing-device', 'ginger-pod', 'paula', 'restore', 'rooms', 'telli-handoff', 'welcome'].sort(),
    )
    expect(scOnb001Flow.designFrames).toBeUndefined()
  })

  it('has a family title for SC-ONB', () => {
    expect(translate(familyTitleKeys['SC-ONB'] ?? '')).toBe('Onboarding')
  })

  it('translates every key it declares', () => {
    const flow = resolveFlow(scOnb001Flow, null)
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
    const flow = resolveFlow(scOnb001Flow, null)
    for (const screenId of Object.keys(scOnb001Flow.screens) as (keyof typeof flow.notes.screens)[]) {
      expect(flow.notes.screens[screenId]?.aboutKey, screenId).toBeTruthy()
    }
    expect(flow.notes.flow.aboutKey).toBe('flows.scOnb001.description')
    expect(flow.notes.flow.questionKeys.map((key) => translate(key))).toEqual([
      'Does the "rooms in a home" picture make pods clear before people have any of their own?',
      'Four beats: is anything missing, or could one go?',
      'Should the Telli demo be required, or stay optional as it is now?',
    ])
    expect(flow.notes.screens['telli-handoff']?.questionKeys).toEqual([])
  })

  it('draws the four beats with one component, so the scene stays mounted between them', () => {
    const [first, ...rest] = BEATS.map((beat) => scOnb001Flow.screens[beat])
    expect(first).toBeDefined()
    for (const screen of rest) expect(screen).toBe(first)
    expect(scOnb001Flow.screens['telli-handoff']).not.toBe(first)
  })

  it('uses the artifact’s copy', () => {
    expect(strings.title).toBe('Tellipod intro: Rooms')
    expect(strings.goal).toBe('Go through the intro and get started with Tellipod.')
    const headline = (beat: keyof typeof intro.beats) => {
      const { lead, accent, tail } = intro.beats[beat].headline
      return `${lead}${accent}${tail}`
    }
    expect(headline('rooms')).toBe('Pods are small\nprivate rooms.')
    expect(headline('gingerPod')).toBe('Telli tidies.\nYou decide.')
    expect(headline('paula')).toBe('Invite Paula.\nSame pod, her phone.')
    expect(headline('welcome')).toBe('Welcome to Tellipod.\nHost your world.')
    expect(intro.standIns.telliHandoff.body.endsWith('Only the intro is built in this prototype.')).toBe(true)
  })
})
