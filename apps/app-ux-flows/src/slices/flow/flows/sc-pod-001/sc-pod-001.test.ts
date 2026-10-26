import type { ComponentProps } from 'react'
import { describe, expect, it } from 'vitest'

import { findFlow, listFlows } from '../../registry'
import { renderScreen } from '../../runtime/render-screen'
import { resolveFlow } from '../../runtime/resolve-flow'
import { scPod001Flow } from './flow'
import { listingAtom } from './model'
import { aboutSofia, maya, samplePods } from './sample-pods'
import { en } from '@/app/locales/en'
import type { PodComponents } from '@/shared/ui/pod-components'

type SectionProps = ComponentProps<PodComponents['PodsSection']>

const translate = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], en)

const caseIds = ['a', 'b', 'c', 'd']

const resolved = (caseId: string | null) => resolveFlow(scPod001Flow, null, caseId)

// Renders Home for a case with the pods section replaced by a recorder of what the screen hands it.
const sectionOf = (caseId: string, store = resolved(caseId).createStore()) => {
  const sections: SectionProps[] = []
  const effects = renderScreen(resolved(caseId), 'home', {
    components: {
      PodsSection: (props: SectionProps) => {
        sections.push(props)
        return null
      },
    },
    store,
  })
  const [section] = sections
  if (!section) throw new Error(`Case ${caseId} rendered no pods section`)
  return { effects, section, store }
}

describe('SC-POD-001 Pods on Home', () => {
  it('is a registered showcase listed after the existing ones, starting on Home, without variants', () => {
    expect(scPod001Flow.kind).toBe('showcase')
    expect(scPod001Flow.code).toBe('SC-POD-001')
    expect(scPod001Flow.initialScreen).toBe('home')
    expect(findFlow('sc-pod-001')).toBe(scPod001Flow)
    expect(listFlows().at(-1)).toBe(scPod001Flow)
    expect(scPod001Flow.variants).toBeUndefined()
    expect(scPod001Flow.variantSelection).toBeUndefined()
  })

  it('has four cases chosen by the reviewer, in order, none hidden', () => {
    expect(resolved(null).cases.map(({ id, code }) => [id, code])).toEqual([
      ['a', 'SC-POD-001-A'],
      ['b', 'SC-POD-001-B'],
      ['c', 'SC-POD-001-C'],
      ['d', 'SC-POD-001-D'],
    ])
    expect(Object.values(scPod001Flow.cases ?? {}).some((flowCase) => flowCase.hidden)).toBe(false)
    expect(resolved(null).caseCode).toBe('SC-POD-001-A')
  })

  it('declares only Home and no Figma frame', () => {
    expect(Object.keys(scPod001Flow.screens)).toEqual(['home'])
    expect(scPod001Flow.designFrames).toBeUndefined()
  })

  it('translates every key it declares', () => {
    const cases = Object.values(scPod001Flow.cases ?? {})
    const keys = [
      scPod001Flow.titleKey,
      scPod001Flow.descriptionKey,
      'flows.scPod001.welcome',
      'flows.scPod001.userInitial',
      ...cases.flatMap((flowCase) => [flowCase.nameKey, flowCase.descriptionKey, flowCase.screenNotes?.home?.aboutKey]),
    ]

    for (const key of keys) {
      expect(key).toBeTruthy()
      expect(typeof translate(key ?? '')).toBe('string')
    }
    expect(cases.map((flowCase) => translate(flowCase.nameKey))).toEqual([
      'With pods',
      'Loading',
      'First run, no pods',
      'Failed to load',
    ])
  })

  it('has the sample pods of the spec', () => {
    expect(samplePods).toEqual([aboutSofia, maya])
    expect(aboutSofia).toMatchObject({
      avatarSrc: null,
      category: { label: 'People' },
      hasUnread: false,
      name: 'About Sofia',
      subcategory: { label: 'Immediate family' },
    })
    expect(maya).toMatchObject({ category: { label: 'Pets' }, hasUnread: true, name: 'Maya' })
    expect(maya.avatarSrc).toBeTruthy()
  })

  it('shows the two pods in the With pods case, with See all pods', () => {
    const { section } = sectionOf('a')

    expect(section.status).toBe('ready')
    expect(section.pods).toEqual([aboutSofia, maya])
    expect(section.onSeeAll).toBeDefined()
  })

  it('shows the list as loading in the Loading case', () => {
    expect(sectionOf('b').section.status).toBe('loading')
  })

  it('shows a loaded list without pods and with Add Pod in the First run case', () => {
    const { section } = sectionOf('c')

    expect(section.status).toBe('ready')
    expect(section.pods).toEqual([])
    expect(section.onAddPod).toBeDefined()
  })

  it('shows the failed state in the Failed to load case', () => {
    expect(sectionOf('d').section.status).toBe('error')
  })

  it('shows loading after Retry, and a restart returns to the failed state', () => {
    const { section, store } = sectionOf('d')
    section.onRetry?.()

    expect(store.get(listingAtom)).toBe('loading')
    expect(sectionOf('d', store).section.status).toBe('loading')
    expect(sectionOf('d').section.status).toBe('error')
  })

  it('keeps every other control inert in every case', () => {
    for (const caseId of caseIds) {
      const { effects, section } = sectionOf(caseId)
      section.onPodPress?.(aboutSofia)
      section.onSeeAll?.()
      section.onAddPod?.()
      section.onDismissEmpty?.()

      expect(effects.navigations).toEqual([])
      expect(effects.tracked).toEqual([])
    }
  })
})
