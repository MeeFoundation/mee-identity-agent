import { createStore } from 'jotai'
import { describe, expect, it } from 'vitest'

import { toAttachmentKind } from '../../pods/attachments/model'
import {
  addedByName,
  addFileAtom,
  completesAdd,
  completesDelete,
  completesRename,
  deleteFileAtom,
  filesAtom,
  nameProblem,
  renameFileAtom,
  selectedFileAtom,
  selectedIdAtom,
  startingFiles,
  uniqueName,
} from './model'

const today = new Date(2026, 9, 20)

const freshStore = () => {
  const store = createStore()
  store.set(filesAtom, startingFiles())
  return store
}

const names = (store: ReturnType<typeof freshStore>) => store.get(filesAtom).map((file) => file.name)

describe('addFileAtom', () => {
  it('adds a media file first in the list, today, by the participant', () => {
    const store = freshStore()
    store.set(addFileAtom, 'media', today)
    expect(store.get(filesAtom)).toHaveLength(5)
    expect(store.get(filesAtom)[0]).toMatchObject({
      addedAt: '2026-10-20',
      addedBy: 'you',
      name: 'photo-jul-15.jpg',
      sizeBytes: 1_500_000,
    })
  })

  it('adds a document', () => {
    const store = freshStore()
    store.set(addFileAtom, 'document', today)
    expect(store.get(filesAtom)[0]).toMatchObject({ name: 'Invoice-june.pdf', sizeBytes: 320_000 })
  })

  it('numbers repeated adds before the extension', () => {
    const store = freshStore()
    store.set(addFileAtom, 'media', today)
    store.set(addFileAtom, 'media', today)
    store.set(addFileAtom, 'media', today)
    expect(names(store).slice(0, 3)).toEqual(['photo-jul-15 3.jpg', 'photo-jul-15 2.jpg', 'photo-jul-15.jpg'])
  })

  it('keeps ids unique after deleting and adding again', () => {
    const store = freshStore()
    const first = store.set(addFileAtom, 'media', today)
    store.set(deleteFileAtom, first.id)
    const second = store.set(addFileAtom, 'media', today)
    expect(second.id).not.toBe(first.id)
  })
})

describe('uniqueName', () => {
  it('numbers a name without an extension at its end', () => {
    expect(uniqueName(startingFiles(), 'About Sophia.databook.mc')).toBe('About Sophia.databook 2.mc')
    expect(uniqueName([{ ...startingFiles()[0], name: 'notes' } as never], 'Notes')).toBe('Notes 2')
  })
})

describe('nameProblem', () => {
  const files = startingFiles()

  it('rejects an empty name', () => {
    expect(nameProblem(files, 'funny-moment', '   ')).toBe('empty')
  })

  it("rejects another file's name, ignoring letter case", () => {
    expect(nameProblem(files, 'funny-moment', 'PHOTO-SOFIA.JPG')).toBe('taken')
  })

  it('accepts the file’s own name and a new name', () => {
    expect(nameProblem(files, 'funny-moment', 'funny-moment.mp4')).toBeNull()
    expect(nameProblem(files, 'funny-moment', 'clip.mp4')).toBeNull()
  })
})

describe('renameFileAtom', () => {
  it('renames in place, keeping size, date and author, and trims the name', () => {
    const store = freshStore()
    const before = store.get(filesAtom)
    const result = store.set(renameFileAtom, 'about-sophia', '  About Sofia.pdf ')
    expect(result).toEqual({ id: 'about-sophia', status: 'renamed' })
    const after = store.get(filesAtom)
    expect(after.map((file) => file.id)).toEqual(before.map((file) => file.id))
    expect(after[3]).toEqual({ ...before[3], name: 'About Sofia.pdf' })
  })

  it('changes the kind with the extension', () => {
    const store = freshStore()
    expect(toAttachmentKind('photo-Sofia.jpg')).toBe('image')
    store.set(renameFileAtom, 'photo-sofia', 'photo-Sofia.pdf')
    expect(toAttachmentKind(store.get(filesAtom)[1]?.name ?? '')).toBe('document')
  })

  it('refuses an empty or taken name and changes nothing', () => {
    const store = freshStore()
    expect(store.set(renameFileAtom, 'funny-moment', '')).toEqual({ problem: 'empty', status: 'invalid' })
    expect(store.set(renameFileAtom, 'funny-moment', 'photo-sofia.jpg')).toEqual({
      problem: 'taken',
      status: 'invalid',
    })
    expect(names(store)).toEqual(startingFiles().map((file) => file.name))
  })

  it('reports a name saved unchanged', () => {
    const store = freshStore()
    expect(store.set(renameFileAtom, 'funny-moment', ' funny-moment.mp4 ')).toEqual({ status: 'unchanged' })
  })
})

describe('deleteFileAtom', () => {
  it('removes the file and returns it', () => {
    const store = freshStore()
    expect(store.set(deleteFileAtom, 'activities-tracker')?.name).toBe('Activities-tracker.xls')
    expect(store.get(filesAtom)).toHaveLength(3)
  })

  it('returns nothing for a file that is gone', () => {
    const store = freshStore()
    store.set(deleteFileAtom, 'activities-tracker')
    expect(store.set(deleteFileAtom, 'activities-tracker')).toBeUndefined()
  })

  it('can empty the list', () => {
    const store = freshStore()
    for (const file of startingFiles()) store.set(deleteFileAtom, file.id)
    expect(store.get(filesAtom)).toEqual([])
  })
})

describe('selectedFileAtom', () => {
  it('is undefined with nothing selected or when the file is gone', () => {
    const store = freshStore()
    expect(store.get(selectedFileAtom)).toBeUndefined()
    store.set(selectedIdAtom, 'funny-moment')
    expect(store.get(selectedFileAtom)?.name).toBe('funny-moment.mp4')
    store.set(deleteFileAtom, 'funny-moment')
    expect(store.get(selectedFileAtom)).toBeUndefined()
  })
})

describe('addedByName', () => {
  it('names other members and leaves the participant out', () => {
    const [funny, photo, , about] = startingFiles()
    expect(addedByName(funny as never)).toBeUndefined()
    expect(addedByName(photo as never)).toBe('Geo')
    expect(addedByName(about as never)).toBe('Andrew')
  })
})

describe('goal checks', () => {
  it('completes adding only for a media file', () => {
    expect(completesAdd('media')).toBe(true)
    expect(completesAdd('document')).toBe(false)
  })

  it('completes renaming only the About Sophia file to a PDF', () => {
    expect(completesRename({ id: 'about-sophia', status: 'renamed' }, 'About Sofia.PDF')).toBe(true)
    expect(completesRename({ id: 'about-sophia', status: 'renamed' }, 'About Sofia.txt')).toBe(false)
    expect(completesRename({ id: 'funny-moment', status: 'renamed' }, 'clip.pdf')).toBe(false)
    expect(completesRename({ status: 'unchanged' }, 'About Sophia.pdf')).toBe(false)
  })

  it('completes deleting only the activities tracker', () => {
    const [funny, , tracker] = startingFiles()
    expect(completesDelete(tracker)).toBe(true)
    expect(completesDelete(funny)).toBe(false)
    expect(completesDelete(undefined)).toBe(false)
  })
})
