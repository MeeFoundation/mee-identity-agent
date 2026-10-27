import { Children, createElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { Toast, type ToastVariant } from './toast'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

const variants: ReadonlyArray<readonly [ToastVariant, string, string, string]> = [
  ['primary', 'border-brand-300 bg-brand-50', 'text-brand-900', 'bi-info-circle'],
  ['secondary', 'border-gray-200 bg-white', 'text-gray-900', 'bi-info-circle'],
  ['tertiary', 'border-gray-300 bg-gray-50', 'text-gray-900', 'bi-info-circle'],
  ['dark', 'border-gray-700 bg-gray-900', 'text-white', 'bi-info-circle'],
  ['success', 'border-success-300 bg-success-50', 'text-success-900', 'bi-check-circle'],
  ['danger', 'border-error-300 bg-error-50', 'text-error-900', 'bi-exclamation-octagon'],
  ['warning', 'border-warning-300 bg-warning-50', 'text-warning-900', 'bi-exclamation-triangle'],
]

const render = (props: Partial<Parameters<typeof Toast>[0]> = {}) =>
  renderToStaticMarkup(createElement(Toast, { onClose: () => {}, title: 'Saved', ...props }))

const buttonsOf = (node: ReactNode): ReactElement<{ onClick: () => void; children: ReactNode }>[] => {
  if (!isValidElement(node)) return []
  const element = node as ReactElement<{ onClick?: () => void; children?: ReactNode }>
  const own = element.type === 'button' ? [element as ReactElement<{ onClick: () => void; children: ReactNode }>] : []
  return [...own, ...Children.toArray(element.props.children).flatMap(buttonsOf)]
}

describe('Toast', () => {
  it('keeps the existing flow usage working: a success toast with an icon, a title and a close button', () => {
    const markup = render({ variant: 'success' })

    expect(markup).toMatch(/^<output/)
    expect(markup).toContain('bi-check-circle')
    expect(markup).toContain('Saved')
    expect(markup).toContain('aria-label="ui.toast.close"')
  })

  it('defaults to the primary variant', () => {
    expect(render()).toContain('border-brand-300 bg-brand-50')
  })

  it.each(variants)('%s has its surface, title colour and default icon', (variant, surface, title, icon) => {
    const markup = render({ description: 'Body', variant })

    expect(markup).toContain(surface)
    expect(markup).toContain(title)
    expect(markup).toContain(icon)
  })

  it('shows the description aligned with the title text, and at the card padding without an icon', () => {
    expect(render({ description: 'Body' })).toContain('pl-5.5')
    expect(render({ description: 'Body', icon: null })).not.toContain('pl-5.5')
    expect(render({ icon: null })).not.toContain('bi-info-circle')
  })

  it('shows a given avatar before the content', () => {
    const markup = render({ avatar: createElement('img', { alt: 'Geo', src: 'geo.png' }) })

    expect(markup.indexOf('<img')).toBeGreaterThan(-1)
    expect(markup.indexOf('<img')).toBeLessThan(markup.indexOf('Saved'))
  })

  it('places actions on the right, before the close button', () => {
    const markup = render({
      actions: [
        { label: 'First', onClick: () => {} },
        { label: 'Second', onClick: () => {} },
      ],
      description: 'Body',
    })

    expect(markup.indexOf('First')).toBeGreaterThan(markup.indexOf('Body'))
    expect(markup.indexOf('Second')).toBeGreaterThan(markup.indexOf('First'))
    expect(markup.indexOf('ui.toast.close')).toBeGreaterThan(markup.indexOf('Second'))
    expect(markup).not.toContain('pt-1.5')
  })

  it('places actions at the bottom under the description, aligned with the title text', () => {
    const markup = render({
      actions: [
        { label: 'First', onClick: () => {} },
        { label: 'Second', onClick: () => {} },
      ],
      actionsPlacement: 'bottom',
      description: 'Body',
    })

    expect(markup.indexOf('First')).toBeGreaterThan(markup.indexOf('Body'))
    expect(markup.indexOf('ui.toast.close')).toBeGreaterThan(markup.indexOf('Second'))
    expect(markup).toContain('pt-1.5')
    expect(markup).toContain('pl-5')
  })

  it('keeps the single action shorthand', () => {
    expect(render({ action: { label: 'Undo', onClick: () => {} } })).toContain('Undo')
  })

  it('runs only the activated action, and the close handler from the close button', () => {
    const first = vi.fn()
    const second = vi.fn()
    const onClose = vi.fn()
    const toast = Toast({
      actions: [
        { label: 'First', onClick: first },
        { label: 'Second', onClick: second },
      ],
      onClose,
      title: 'Saved',
    })

    const [firstButton, secondButton, closeButton] = buttonsOf(toast)
    secondButton?.props.onClick()
    closeButton?.props.onClick()

    expect(firstButton).toBeDefined()
    expect(second).toHaveBeenCalledOnce()
    expect(first).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledOnce()
  })
})
