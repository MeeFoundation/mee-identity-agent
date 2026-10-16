import { describe, expect, it } from 'vitest'

import { toAttachmentKind } from './model'

describe('toAttachmentKind', () => {
  it.each([
    ['funny-moment.mp4', 'video'],
    ['clip.MOV', 'video'],
    ['photo-Sofia.jpg', 'image'],
    ['photo-Sofia.JPG', 'image'],
    ['scan.png', 'image'],
    ['IMG_0042.heic', 'image'],
    ['Activities-tracker.xls', 'spreadsheet'],
    ['budget.xlsx', 'spreadsheet'],
    ['export.csv', 'spreadsheet'],
    ['plan.numbers', 'spreadsheet'],
  ])('reads %s as %s', (name, kind) => {
    expect(toAttachmentKind(name)).toBe(kind)
  })

  it('falls back to a document for an unknown or missing extension', () => {
    expect(toAttachmentKind('About Sophia.databook.mc')).toBe('document')
    expect(toAttachmentKind('notes.pdf')).toBe('document')
    expect(toAttachmentKind('README')).toBe('document')
  })
})
