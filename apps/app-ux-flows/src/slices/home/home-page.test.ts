import { createInstance } from 'i18next'
import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'

import { en } from '@/app/locales/en'

import type { FlowLauncher } from './flow-row'
import { HomePage } from './home-page'
import type { FlowKind } from '@/slices/flow/runtime/define-flow'

type ButtonProps = { children: ReactNode; onClick?: () => void }

const buttons = vi.hoisted(() => [] as ButtonProps[])

vi.mock('@/shared/ui/button', () => ({
  Button: (props: ButtonProps) => {
    buttons.push(props)
    return createElement('button', { type: 'button' }, props.children)
  },
}))

const i18n = createInstance()
i18n.init({ initAsync: false, lng: 'en', resources: { en: { translation: en } } })

type RenderOptions = {
  devModeNote?: boolean
  onTurnOffDevMode?: () => void
  flows?: readonly FlowLauncher[]
  showCodes?: boolean
  openGroups?: ReadonlySet<string>
}

const render = ({
  devModeNote = false,
  onTurnOffDevMode = () => {},
  flows = [],
  showCodes = false,
  openGroups = new Set<string>(),
}: RenderOptions) => {
  buttons.length = 0
  return renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(HomePage, {
        devModeNote,
        flows,
        onOpenScreen: () => {},
        onStartFlow: () => {},
        onStartNewSession: () => {},
        onToggleGroup: () => {},
        onTurnOffDevMode,
        openGroups,
        screenHref: () => '',
        showCodes,
      }),
    ),
  )
}

const renderHome = (devModeNote: boolean, onTurnOffDevMode = () => {}) => render({ devModeNote, onTurnOffDevMode })

const flow = (id: string, code: string | null, kind: FlowKind = 'showcase', hidden = false): FlowLauncher => ({
  assignedVariantId: null,
  caseChoices: null,
  catalogue: null,
  code,
  descriptionKey: null,
  hidden,
  id,
  kind,
  titleKey: id,
  variantChoices: null,
})

const showcases = [
  flow('sc-pet-001', 'SC-PET-001'),
  flow('sc-pet-002', 'SC-PET-002'),
  flow('chat-add-medication', 'SC-PET-005'),
  flow('sc-ppl-001', 'SC-PPL-001'),
  flow('sc-ppl-002', 'SC-PPL-002'),
  flow('exp-pet-002', 'EXP-PET-002', 'experiment'),
]

const startActions = () => buttons.filter(({ children }) => children === 'Start').length

describe('HomePage dev mode note', () => {
  it('shows "Dev mode" with "Turn off" only when dev mode came from the URL', () => {
    expect(renderHome(true)).toContain('Dev mode')
    expect(buttons.some(({ children }) => children === 'Turn off')).toBe(true)

    expect(renderHome(false)).not.toContain('Dev mode')
    expect(buttons.some(({ children }) => children === 'Turn off')).toBe(false)
  })

  it('turns dev mode off through the route when "Turn off" is activated', () => {
    const turnOff = vi.fn()
    renderHome(true, turnOff)
    buttons.find(({ children }) => children === 'Turn off')?.onClick?.()

    expect(turnOff).toHaveBeenCalledOnce()
  })
})

describe('HomePage flow groups', () => {
  it('starts every group collapsed, with its title and count', () => {
    const html = render({ flows: showcases })

    expect(html).toContain('Showcases (5)')
    expect(html).toContain('Pet care (3)')
    expect(html).toContain('People (2)')
    expect(html.match(/aria-expanded="false"/g)).toHaveLength(2)
    expect(html).not.toContain('sc-pet-001')
    expect(startActions()).toBe(1)
  })

  it('shows the rows of the groups that are open', () => {
    const html = render({ flows: showcases, openGroups: new Set(['showcase:SC-PET']) })

    expect(html).toContain('aria-expanded="true"')
    expect(html).toContain('sc-pet-001')
    expect(html).toContain('chat-add-medication')
    expect(html).not.toContain('sc-ppl-001')
    expect(startActions()).toBe(4)
  })

  it('keeps a lone family as a plain row', () => {
    const html = render({ flows: showcases })

    expect(html).toContain('Experiments (1)')
    expect(html).toContain('exp-pet-002')
  })

  it('shows family codes only in dev mode', () => {
    expect(render({ flows: showcases, showCodes: true })).toContain('SC-PET</span>')
    expect(render({ flows: showcases })).not.toContain('SC-PET')
  })

  it('marks a group whose flows are all hidden', () => {
    const flows = [
      flow('sc-pet-001', 'SC-PET-001', 'showcase', true),
      flow('sc-pet-002', 'SC-PET-002', 'showcase', true),
    ]

    expect(render({ flows })).toContain('Hidden in production')
    expect(render({ flows: [flows[0], flow('sc-pet-003', 'SC-PET-003')] })).not.toContain('Hidden in production')
  })
})
