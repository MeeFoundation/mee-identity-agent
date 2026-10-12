import { describe, expect, it } from 'vitest'

import type { ContactInfoRecord } from '../people/contact-info'
import { applyTidy, hasContactLink, type NoteBlock, previewTidy, recogniseLines } from './tidy'

const sofia = { firstName: 'Sofia', lastName: 'Walker' }
const knownSofia: ContactInfoRecord = { dateOfBirth: '2018-04-08', firstName: 'Sofia', lastName: 'Walker' }

const text = (id: string, value: string): NoteBlock => ({ id, kind: 'text', text: value })
const link: NoteBlock = { id: 'link', kind: 'contact-link' }

const createNote = [text('note', '#family #care\n\nSofia Walker\nBorn 04/08/2018\nemail sofiawalker18@gmail.com')]
const updateNote = [
  text('top', '#family #care\n'),
  link,
  text('bottom', 'Piano on Tuesdays\nSofia email: sofia@example.com'),
]

describe('recogniseLines', () => {
  it('recognises the full name, a US date of birth and an email, in note order', () => {
    expect(recogniseLines(createNote, sofia, {})).toEqual([
      {
        blockId: 'note',
        kind: 'name',
        lineIndex: 2,
        status: 'new',
        values: { firstName: 'Sofia', lastName: 'Walker' },
      },
      { blockId: 'note', kind: 'birth', lineIndex: 3, status: 'new', values: { dateOfBirth: '2018-04-08' } },
      { blockId: 'note', kind: 'email', lineIndex: 4, status: 'new', values: { email: 'sofiawalker18@gmail.com' } },
    ])
  })

  it('marks lines whose values Contact info already holds as known', () => {
    expect(recogniseLines(createNote, sofia, knownSofia).map((line) => line.status)).toEqual(['known', 'known', 'new'])
  })

  it('reads 04/08/2018 as April 8, 2018', () => {
    expect(recogniseLines([text('n', 'Born 04/08/2018')], sofia, {})[0]?.values).toEqual({ dateOfBirth: '2018-04-08' })
  })

  it('ignores case and surrounding spaces in the name, and takes only the address from an email line', () => {
    const lines = recogniseLines([text('n', '  sofia walker \nSofia email: sofia@example.com')], sofia, {})
    expect(lines.map((line) => line.values)).toEqual([
      { firstName: 'Sofia', lastName: 'Walker' },
      { email: 'sofia@example.com' },
    ])
  })

  it('recognises nothing in free text, impossible dates or other names', () => {
    const note = [text('n', '#family #care\n\nPiano on Tuesdays\nHates broccoli\nBorn 02/30/2018\nSofia Smith\nSofia')]
    expect(recogniseLines(note, sofia, {})).toEqual([])
  })

  it('looks only at text, not at links', () => {
    expect(recogniseLines(updateNote, sofia, knownSofia)).toEqual([
      { blockId: 'bottom', kind: 'email', lineIndex: 1, status: 'new', values: { email: 'sofia@example.com' } },
    ])
  })
})

describe('previewTidy', () => {
  it('shows every value after tidying and marks the fields of new lines', () => {
    const preview = previewTidy(knownSofia, recogniseLines(createNote, sofia, knownSofia))
    expect(preview.record).toEqual({ ...knownSofia, email: 'sofiawalker18@gmail.com' })
    expect([...preview.newFields]).toEqual(['email'])
  })

  it('keeps the saved details in an update through the link', () => {
    const preview = previewTidy(knownSofia, recogniseLines(updateNote, sofia, knownSofia))
    expect(preview.record).toEqual({ ...knownSofia, email: 'sofia@example.com' })
    expect([...preview.newFields]).toEqual(['email'])
  })

  it('marks every field new for an empty contact', () => {
    const preview = previewTidy({}, recogniseLines(createNote, sofia, {}))
    expect([...preview.newFields].sort()).toEqual(['dateOfBirth', 'email', 'firstName', 'lastName'])
  })
})

describe('applyTidy', () => {
  it('replaces the lines with a link and keeps a place to type below it', () => {
    const result = applyTidy(createNote, knownSofia, recogniseLines(createNote, sofia, knownSofia))

    expect(result.blocks).toEqual([
      text('note.a', '#family #care\n'),
      { id: 'note.link', kind: 'contact-link' },
      text('note.b', ''),
    ])
    expect(result.contact).toEqual({ ...knownSofia, email: 'sofiawalker18@gmail.com' })
    expect(result.insertedLink).toBe(true)
  })

  it('keeps the text after the lines below the link', () => {
    const note = [text('n', 'Sofia Walker\nBorn 04/08/2018\nPiano on Tuesdays')]
    expect(applyTidy(note, {}, recogniseLines(note, sofia, {})).blocks).toEqual([
      { id: 'n.link', kind: 'contact-link' },
      text('n.b', 'Piano on Tuesdays'),
    ])
  })

  it('adds the lines to an existing link without a second one', () => {
    const result = applyTidy(updateNote, knownSofia, recogniseLines(updateNote, sofia, knownSofia))

    expect(result.blocks).toEqual([text('top', '#family #care\n'), link, text('bottom', 'Piano on Tuesdays')])
    expect(result.blocks.filter((block) => block.kind === 'contact-link')).toHaveLength(1)
    expect(result.contact.email).toBe('sofia@example.com')
    expect(result.insertedLink).toBe(false)
  })

  it('leaves one empty line where lines between empty lines were removed', () => {
    const note = [text('top', 'Intro'), link, text('n', 'Piano\n\nemail a@b.co\n\nBroccoli')]
    expect(applyTidy(note, {}, recogniseLines(note, sofia, {})).blocks[2]).toEqual(text('n', 'Piano\n\nBroccoli'))
  })

  it('replaces a saved value with the one from the note', () => {
    const note = [text('n', 'Born 05/09/2017')]
    expect(applyTidy(note, knownSofia, recogniseLines(note, sofia, knownSofia)).contact.dateOfBirth).toBe('2017-05-09')
  })
})

describe('hasContactLink', () => {
  it('tells whether the note links to Contact info', () => {
    expect(hasContactLink(createNote)).toBe(false)
    expect(hasContactLink(updateNote)).toBe(true)
  })
})
