import { createElement } from 'react'
import { Plus } from 'react-bootstrap-icons'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { FloatingActionButton } from './floating-action-button'

describe('FloatingActionButton', () => {
  it('is a button named by its label, with the icon hidden from assistive technology', () => {
    const markup = renderToStaticMarkup(
      createElement(FloatingActionButton, { icon: Plus, label: 'Add attachment', onClick: () => {} }),
    )

    expect(markup).toMatch(/^<button[^>]*type="button"/)
    expect(markup).toContain('aria-hidden="true"')
    expect(markup).toMatch(/<\/svg>Add attachment<\/button>$/)
  })
})
