import { createInstance } from 'i18next'
import { Provider } from 'jotai'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it } from 'vitest'

import { toDoseHistory } from '../../pods/ginger/dose-history'
import {
  doseHistoryAtom,
  giveDoseAtom,
  medicationAtom,
  medicationDoseAtom,
  PARTICIPANT_ID,
  podMembersAtom,
} from '../../pods/ginger/model'
import { findFlow, listFlows } from '../../registry'
import { FlowRuntimeContext } from '../../runtime/flow-context'
import { resolveFlow } from '../../runtime/resolve-flow'
import { MedicalView } from './components/medical-view'
import { scPet006Flow } from './flow'
import {
  accessAtom,
  createInviteAtom,
  goalAtom,
  invitesAtom,
  markInviteSentAtom,
  memberCountAtom,
  membersAtom,
  selectedInviteAtom,
  sentToastAtom,
} from './model'
import { en } from '@/app/locales/en'
import { defaultComponents } from '@/shared/ui/default-components'
import { podComponents } from '@/shared/ui/pod-components'

// Resolves an i18next key such as `flows.scPet006.title` against the English strings.
const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

const caseRun = (caseId: string) => resolveFlow(scPet006Flow, null, caseId).createStore()

type Store = ReturnType<typeof caseRun>

const i18n = createInstance()
i18n.init({
  initAsync: false,
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: { en: { translation: en } },
})

const renderMedical = (store: Store) =>
  renderToStaticMarkup(
    createElement(
      Provider,
      { store },
      createElement(
        I18nextProvider,
        { i18n },
        createElement(
          FlowRuntimeContext.Provider,
          {
            value: {
              analytics: { track: () => {} },
              components: { ...defaultComponents, ...podComponents },
              navigation: { back: () => {}, complete: () => {}, goToScreen: () => {}, restart: () => {} },
              screenId: 'medical',
            },
          },
          createElement(MedicalView),
        ),
      ),
    ),
  )

describe('SC-PET-006 Share Ginger’s care', () => {
  it('is a registered showcase with three cases, listed after SC-PET-005 and starting on Info', () => {
    expect(scPet006Flow.kind).toBe('showcase')
    expect(scPet006Flow.code).toBe('SC-PET-006')
    expect(scPet006Flow.initialScreen).toBe('info')
    expect(findFlow('sc-pet-006')).toBe(scPet006Flow)
    const ids = listFlows().map((flow) => flow.id)
    expect(ids.indexOf('sc-pet-006')).toBe(ids.indexOf('chat-add-medication') + 1)
    expect(resolveFlow(scPet006Flow, null).cases.map(({ id, code }) => [id, code])).toEqual([
      ['a', 'SC-PET-006-A'],
      ['b', 'SC-PET-006-B'],
      ['c', 'SC-PET-006-C'],
    ])
  })

  it('declares its seven screens', () => {
    expect(Object.keys(scPet006Flow.screens).sort()).toEqual([
      'dose-history',
      'give-dose',
      'info',
      'invite-name',
      'invite-share',
      'medical',
      'members',
    ])
  })

  it('translates every key it declares', () => {
    const keys = ['a', 'b', 'c'].flatMap((caseId) => {
      const flow = resolveFlow(scPet006Flow, null, caseId)
      return [
        flow.titleKey,
        flow.descriptionKey,
        flow.goalKey,
        flow.caseNameKey,
        ...Object.values(flow.hints),
        ...flow.notes.flow.questionKeys,
        flow.notes.case?.aboutKey,
        ...(flow.notes.case?.questionKeys ?? []),
        ...Object.values(flow.notes.screens).flatMap((note) => [note?.aboutKey, ...(note?.questionKeys ?? [])]),
      ]
    })
    for (const key of keys) expect(typeof translate(key ?? ''), String(key)).toBe('string')
  })

  it('starts case A as Sam alone, able to invite', () => {
    const store = caseRun('a')
    expect(store.get(accessAtom)).toBe('owner')
    expect(store.get(goalAtom)).toBe('invite')
    expect(store.get(membersAtom).map(({ name, role }) => [name, role])).toEqual([['Sam', 'owner']])
    expect(store.get(memberCountAtom)).toBe(1)
  })

  it('starts cases B and C as Geo with the access each case studies', () => {
    const b = caseRun('b')
    expect(b.get(membersAtom).map(({ name, role }) => [name, role])).toEqual([
      ['Sam', 'owner'],
      ['Geo', 'viewer'],
    ])
    expect(b.get(goalAtom)).toBe('history')

    const c = caseRun('c')
    expect(c.get(membersAtom).at(-1)).toMatchObject({ name: 'Geo', role: 'logger' })
    expect(c.get(goalAtom)).toBe('dose')
  })

  it('creates an invite with the chosen access and a fresh link, then reports it sent', () => {
    const store = caseRun('a')
    store.set(createInviteAtom, { name: '  Geo ', role: 'viewer' })
    store.set(createInviteAtom, { name: 'Alex', role: 'logger' })
    const [first, second] = store.get(invitesAtom)
    expect(first).toMatchObject({ link: 'pod.app/i/x7f2-4k9a', name: 'Geo', role: 'viewer', sentDaysAgo: 0 })
    expect(second?.link).not.toBe(first?.link)
    expect(store.get(memberCountAtom)).toBe(3)

    expect(store.get(selectedInviteAtom)?.name).toBe('Alex')
    store.set(markInviteSentAtom)
    expect(store.get(sentToastAtom)).toBe('Alex')
  })

  it('shows Mark as given and no Add medication to a member who can log doses', () => {
    const markup = renderMedical(caseRun('c'))
    expect(markup).toContain('Mark as given')
    expect(markup).not.toContain('Add medication')
  })

  it('shows the due dose without Mark as given to a viewer', () => {
    const markup = renderMedical(caseRun('b'))
    expect(markup).toContain('Apoquel')
    expect(markup).not.toContain('Mark as given')
    expect(markup).not.toContain('Add medication')
  })

  it('shows a dose someone else gave as given, with their name and no way to give it again', () => {
    const store = caseRun('c')
    store.set(medicationDoseAtom, {
      ...store.get(medicationDoseAtom),
      givenAt: new Date().toISOString(),
      givenBy: 'sam',
      status: 'given',
    })
    const markup = renderMedical(store)
    expect(markup).toContain('· Sam')
    expect(markup).not.toContain('Mark as given')
    expect(markup).not.toContain('Undo')
  })

  it('records a dose given by the sitter as theirs, and names them to the owner', () => {
    const store = caseRun('c')
    const medication = store.get(medicationAtom)
    store.set(giveDoseAtom, new Date())
    expect(store.get(medicationDoseAtom)).toMatchObject({ givenBy: PARTICIPANT_ID, status: 'given' })
    expect(store.get(medicationAtom)).toBe(medication)

    const history = toDoseHistory(
      store.get(medicationDoseAtom),
      store.get(doseHistoryAtom),
      { medicationId: 'all', period: 'all' },
      new Date(),
    )
    expect(history[0]).toMatchObject({ givenBy: PARTICIPANT_ID, status: 'given' })
    expect(store.get(podMembersAtom).map(({ name }) => name)).toEqual(['Sam'])
  })

  it('lists Sam as the previous giver in the history the sitter reads', () => {
    const store = caseRun('b')
    expect(store.get(doseHistoryAtom)[0]).toMatchObject({ givenBy: 'sam', status: 'given' })
  })
})
