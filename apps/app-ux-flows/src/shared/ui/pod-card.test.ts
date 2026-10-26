import { isValidElement, type ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { PodCard } from './pod-card'
import type { PodSummary } from './pod-summary'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

const maya: PodSummary = {
  avatarSrc: null,
  category: { label: 'Pets' },
  hasUnread: false,
  id: 'maya',
  name: 'Maya',
}

describe('PodCard', () => {
  it('calls the press handler with its pod', () => {
    const onPress = vi.fn()
    const card = PodCard({ onPress, pod: maya })

    if (!isValidElement(card)) throw new Error('PodCard did not render an element')
    const { onClick } = (card as ReactElement<{ onClick: () => void }>).props
    onClick()

    expect(onPress).toHaveBeenCalledExactlyOnceWith(maya)
  })

  it('does nothing when pressed without a handler', () => {
    const card = PodCard({ pod: maya })

    expect(() => (card as ReactElement<{ onClick: () => void }>).props.onClick()).not.toThrow()
  })
})
