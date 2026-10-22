import { type ComponentProps, createElement } from 'react'
import { describe, expect, it } from 'vitest'

import { findFlow, listFlows } from '../../registry'
import { renderScreen } from '../../runtime/render-screen'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scOnb003Flow } from '../sc-onb-003/flow'
import { POD_EXAMPLES } from './examples'
import { scOnb004Flow } from './flow'
import { contactsPromptAtom, emptyProfile, fixtureContacts, profileAtom, SCREEN_IDS, skippedTourAtom } from './model'
import {
  beat3StateAt,
  EXAMPLE_INTERVAL_MS,
  exampleIndexAt,
  NEW_VET,
  OLD_VET,
  SHARE_SYNCED_MS,
  shareStateAt,
} from './motion'
import { en } from '@/app/locales/en'
import type { DefaultComponents } from '@/shared/ui/default-components'
import { familyTitleKeys } from '@/slices/home/flow-families'

const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

const strings = en.flows.scOnb004

type ButtonProps = ComponentProps<DefaultComponents['Button']>
type FieldProps = ComponentProps<DefaultComponents['TextField']>

const captured = () => {
  const buttons: ButtonProps[] = []
  const fields: FieldProps[] = []
  const components = {
    Button: (props: ButtonProps) => {
      buttons.push(props)
      return createElement('button', { type: 'button' }, props.children)
    },
    TextField: (props: FieldProps) => {
      fields.push(props)
      return null
    },
  }
  return { buttons, components, fields }
}

const click = (buttons: ButtonProps[], label: string) => {
  const button = buttons.find((item) => item.children === label)
  if (!button) throw new Error(`No button labelled ${label}`)
  button.onClick()
}

describe('SC-ONB-004 Tellipod intro: Onboarding v2', () => {
  it('is a registered showcase without cases, listed after SC-ONB-003 and starting on landing', () => {
    expect(scOnb004Flow.kind).toBe('showcase')
    expect(scOnb004Flow.code).toBe('SC-ONB-004')
    expect(scOnb004Flow.initialScreen).toBe('landing')
    expect(findFlow('sc-onb-004')).toBe(scOnb004Flow)
    const flows = listFlows()
    expect(flows.indexOf(scOnb004Flow)).toBe(flows.indexOf(scOnb003Flow) + 1)
    expect(resolveFlow(scOnb004Flow, null).cases).toEqual([])
  })

  it('declares the ten screens, with no Figma frames', () => {
    expect(Object.keys(scOnb004Flow.screens).sort()).toEqual([...SCREEN_IDS].sort())
    expect(scOnb004Flow.designFrames).toBeUndefined()
  })

  it('has a family title for SC-ONB', () => {
    expect(translate(familyTitleKeys['SC-ONB'] ?? '')).toBe('Onboarding')
  })

  it('translates every key it declares', () => {
    const flow = resolveFlow(scOnb004Flow, null)
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
    const flow = resolveFlow(scOnb004Flow, null)
    for (const screenId of Object.keys(scOnb004Flow.screens) as (keyof typeof flow.notes.screens)[]) {
      expect(flow.notes.screens[screenId]?.aboutKey, screenId).toBeTruthy()
    }
    expect(flow.notes.flow.aboutKey).toBe('flows.scOnb004.description')
    expect(flow.notes.flow.questionKeys.map((key) => translate(key))).toEqual([
      'Is a one-minute tour clearer than the four-beat rooms story?',
      'Does skipping to setup make it too easy to miss what a pod is?',
      'Should simulated contacts stay in a demo, or only a manual form?',
    ])
    expect(flow.notes.screens.pairing?.questionKeys).toEqual([])
    expect(flow.notes.screens.next?.questionKeys).toEqual([])
  })

  it('uses the spec’s copy', () => {
    expect(strings.title).toBe('Tellipod intro: Onboarding v2')
    expect(strings.description).toBe(
      'The next first-run: a one-minute tour of pods, then set up a local profile. No account.',
    )
    expect(strings.goal).toBe('Go through the intro and get started with Tellipod.')
    expect(strings.landing.headline).toBe('Get to know Tellipod in a minute')
    expect(strings.actions.showMeAround).toBe('Show me around')
    expect(strings.actions.skipToSetup).toBe('I know Tellipod, skip to setup')
    expect(strings.tour.podAnything.headline).toBe('A pod for anything')
    expect(strings.tour.shareOnce.headline).toBe('Share it once. Everyone stays up to date.')
    expect(strings.tour.yoursToKeep.noAccounts).toBe('No accounts.')
    expect(strings.tour.yoursToKeep.closing).toBe('Just you and the people you choose.')
    expect(strings.setup.headline).toBe("Let's set up your Tellipod")
    expect(strings.profile.deviceOnly).toBe('Saved on your device only. No cloud, no servers.')
    expect(strings.devices.headline).toBe('Do you use more than one device?')
    expect(strings.standIn.pairingTitle).toBe('Pairing another device')
    expect(strings.standIn.nextTitle).toBe('What comes next')
  })

  it('keeps the five pod examples from the spec', () => {
    expect(POD_EXAMPLES.map((example) => [example.tab, example.name, example.caption])).toEqual([
      ['Trip', 'Lisbon trip', 'Everyone has the same plan, even offline.'],
      ['Care', "Mom's care", 'You and your siblings see the same meds list, always current.'],
      ['Pets', 'Pet care', 'The walker always has the latest vet number.'],
      ['Reno', 'Kitchen reno', 'Quotes and decisions in one place, not lost in texts.'],
      ['Books', 'Book club', 'The next book and host, without scrolling back.'],
    ])
    expect(exampleIndexAt(0, POD_EXAMPLES.length)).toBe(0)
    expect(exampleIndexAt(EXAMPLE_INTERVAL_MS, POD_EXAMPLES.length)).toBe(1)
    expect(exampleIndexAt(EXAMPLE_INTERVAL_MS * 4, POD_EXAMPLES.length)).toBe(4)
  })

  it('advances the share story to the synced vet number', () => {
    expect(shareStateAt(0, false)).toEqual({ number: OLD_VET, step: 'yours' })
    expect(shareStateAt(SHARE_SYNCED_MS, false)).toEqual({ number: NEW_VET, step: 'synced' })
    expect(shareStateAt(0, true)).toEqual({ number: NEW_VET, step: 'synced' })
  })

  it('reveals beat 3’s closing line after the prototype delays', () => {
    expect(beat3StateAt(0, false)).toEqual({ closingVisible: false, dimmed: false, visibleLines: 0 })
    expect(beat3StateAt(2870, false)).toEqual({ closingVisible: true, dimmed: true, visibleLines: 4 })
    expect(beat3StateAt(0, true)).toEqual({ closingVisible: true, dimmed: true, visibleLines: 4 })
  })

  it('opens the tour or skips to setup from landing', () => {
    const { buttons, components } = captured()
    const store = resolveFlow(scOnb004Flow, null).createStore()
    const effects = renderScreen(resolveFlow(scOnb004Flow, null), 'landing', { components, store })
    click(buttons, strings.actions.showMeAround)
    expect(effects.navigations).toEqual(['pod-anything'])
    expect(store.get(skippedTourAtom)).toBe(false)

    const skip = captured()
    const skipStore = resolveFlow(scOnb004Flow, null).createStore()
    const skipEffects = renderScreen(resolveFlow(scOnb004Flow, null), 'landing', {
      components: skip.components,
      store: skipStore,
    })
    click(skip.buttons, strings.actions.skipToSetup)
    expect(skipEffects.navigations).toEqual(['setup'])
    expect(skipStore.get(skippedTourAtom)).toBe(true)
  })

  it('moves the tour with Next, Skip and the last-beat action', () => {
    const next = captured()
    const nextEffects = renderScreen(resolveFlow(scOnb004Flow, null), 'pod-anything', { components: next.components })
    click(next.buttons, strings.actions.next)
    expect(nextEffects.navigations).toEqual(['share-once'])

    const skip = captured()
    const skipEffects = renderScreen(resolveFlow(scOnb004Flow, null), 'pod-anything', { components: skip.components })
    click(skip.buttons, strings.actions.skip)
    expect(skipEffects.navigations).toEqual(['setup'])

    const last = captured()
    const lastEffects = renderScreen(resolveFlow(scOnb004Flow, null), 'yours-to-keep', { components: last.components })
    click(last.buttons, strings.actions.gotIt)
    expect(lastEffects.navigations).toEqual(['setup'])
  })

  it('opens profile setup or pairing from the chooser', () => {
    const { buttons, components } = captured()
    const effects = renderScreen(resolveFlow(scOnb004Flow, null), 'setup', { components })
    click(buttons, strings.actions.setupThisPhone)
    click(buttons, strings.actions.pairOtherDevice)
    expect(effects.navigations).toEqual(['profile-choose', 'pairing'])
    expect(effects.completed).toBe(false)
  })

  it('opens an empty form from manual details', () => {
    const { buttons, components } = captured()
    const store = resolveFlow(scOnb004Flow, null).createStore()
    const effects = renderScreen(resolveFlow(scOnb004Flow, null), 'profile-choose', { components, store })
    click(buttons, strings.actions.manual)
    expect(effects.navigations).toEqual(['profile-form'])
    expect(store.get(profileAtom)).toEqual(emptyProfile())

    const prompt = captured()
    const promptStore = resolveFlow(scOnb004Flow, null).createStore()
    renderScreen(resolveFlow(scOnb004Flow, null), 'profile-choose', {
      components: prompt.components,
      store: promptStore,
    })
    click(prompt.buttons, strings.actions.contactCard)
    expect(promptStore.get(contactsPromptAtom)).toBe('asking')
  })

  it('opens an empty form when contacts are declined, and a filled form from a fixture', () => {
    const declined = captured()
    const declinedStore = resolveFlow(scOnb004Flow, null).createStore()
    declinedStore.set(contactsPromptAtom, 'asking')
    const declinedEffects = renderScreen(resolveFlow(scOnb004Flow, null), 'profile-choose', {
      components: declined.components,
      store: declinedStore,
    })
    click(declined.buttons, strings.contacts.dontAllow)
    expect(declinedEffects.navigations).toEqual(['profile-form'])
    expect(declinedStore.get(profileAtom)).toEqual(emptyProfile())

    const picked = captured()
    const pickedStore = resolveFlow(scOnb004Flow, null).createStore()
    pickedStore.set(contactsPromptAtom, 'picking')
    const pickedEffects = renderScreen(resolveFlow(scOnb004Flow, null), 'profile-choose', {
      components: picked.components,
      store: pickedStore,
    })
    const ada = fixtureContacts[0]
    click(picked.buttons, `${ada?.firstName} ${ada?.lastName}`)
    expect(pickedEffects.navigations).toEqual(['profile-form'])
    expect(pickedStore.get(profileAtom)).toEqual({
      countryCode: ada?.countryCode,
      email: ada?.email,
      firstName: ada?.firstName,
      lastName: ada?.lastName,
      phone: ada?.phone,
    })
  })

  it('stays on the form without a first name, then continues with one', () => {
    const empty = captured()
    const store = resolveFlow(scOnb004Flow, null).createStore()
    const emptyEffects = renderScreen(resolveFlow(scOnb004Flow, null), 'profile-form', {
      components: empty.components,
      store,
    })
    click(empty.buttons, strings.actions.continue)
    expect(emptyEffects.navigations).toEqual([])

    const named = captured()
    const namedEffects = renderScreen(resolveFlow(scOnb004Flow, null), 'profile-form', {
      components: named.components,
      store,
    })
    named.fields[0]?.onChange('Ada')
    click(named.buttons, strings.actions.continue)
    expect(namedEffects.navigations).toEqual(['devices'])
    expect(store.get(profileAtom).firstName).toBe('Ada')
  })

  it('pairs without completing, and finishes setup on I’ll do this later', () => {
    const store = resolveFlow(scOnb004Flow, null).createStore()
    store.set(profileAtom, { ...emptyProfile(), firstName: 'Ada' })
    const pair = captured()
    const pairEffects = renderScreen(resolveFlow(scOnb004Flow, null), 'devices', {
      components: pair.components,
      store,
    })
    click(pair.buttons, strings.actions.pairAnother)
    expect(pairEffects.navigations).toEqual(['pairing'])
    expect(pairEffects.completed).toBe(false)

    const later = captured()
    const laterEffects = renderScreen(resolveFlow(scOnb004Flow, null), 'devices', {
      components: later.components,
      store,
    })
    click(later.buttons, strings.actions.later)
    expect(laterEffects.navigations).toEqual(['next'])
    expect(laterEffects.completed).toBe(true)
  })

  it('closes pairing without completing', () => {
    const { buttons, components } = captured()
    const effects = renderScreen(resolveFlow(scOnb004Flow, null), 'pairing', { components })
    click(buttons, strings.actions.close)
    expect(effects.navigations).toEqual(['back'])
    expect(effects.completed).toBe(false)
  })
})
