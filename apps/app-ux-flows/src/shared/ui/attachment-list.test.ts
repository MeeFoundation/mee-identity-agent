import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { AttachmentList } from './attachment-list'

const count = (markup: string, pattern: RegExp) => markup.match(pattern)?.length ?? 0

describe('AttachmentList', () => {
  it('puts every row in one list, with a divider only between rows', () => {
    const rows = ['a', 'b', 'c', 'd'].map((key) => createElement('span', { key }, key))
    const markup = renderToStaticMarkup(createElement(AttachmentList, null, rows))

    expect(count(markup, /<ul/g)).toBe(1)
    expect(count(markup, /<li/g)).toBe(4)
    expect(count(markup, /<img/g)).toBe(3)
    expect(markup).toMatch(/^<ul[^>]*><li><span>a<\/span><\/li>/)
  })
})
