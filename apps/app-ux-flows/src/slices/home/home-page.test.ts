import { createInstance } from 'i18next'
import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { I18nextProvider } from 'react-i18next'
import { describe, expect, it, vi } from 'vitest'

import { en } from '@/app/locales/en'

import { HomePage } from './home-page'

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

const renderHome = (devModeNote: boolean, onTurnOffDevMode = () => {}) => {
  buttons.length = 0
  return renderToStaticMarkup(
    createElement(
      I18nextProvider,
      { i18n },
      createElement(HomePage, {
        devModeNote,
        flows: [],
        onOpenScreen: () => {},
        onStartFlow: () => {},
        onStartNewSession: () => {},
        onTurnOffDevMode,
        screenHref: () => '',
      }),
    ),
  )
}

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
