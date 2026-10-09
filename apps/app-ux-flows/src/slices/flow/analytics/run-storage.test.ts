import { describe, expect, it } from 'vitest'

import { createRunStorage, type RunRecord } from './run-storage'

const createFakeStorage = (): Storage => {
  const items = new Map<string, string>()
  return {
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    get length() {
      return items.size
    },
    removeItem: (key) => {
      items.delete(key)
    },
    setItem: (key, value) => {
      items.set(key, value)
    },
  }
}

const throwingStorage = (): Storage => {
  throw new Error('storage blocked')
}

const record: RunRecord = {
  runId: 'run-1',
  startedAt: 1000,
  status: 'in-progress',
  variantId: 'a',
  variantSource: 'assigned',
  visitedScreenIds: ['ginger-notes'],
}

describe('run storage', () => {
  it('reads, writes and removes one record per flow', () => {
    const storage = createFakeStorage()
    const runs = createRunStorage(() => storage)

    expect(runs.read('exp-pet-002')).toBeNull()

    runs.write('exp-pet-002', record)
    runs.write('other-flow', { ...record, runId: 'run-2' })

    expect(createRunStorage(() => storage).read('exp-pet-002')).toEqual(record)
    expect(storage.getItem('ux-flows:analytics-run:exp-pet-002')).not.toBeNull()

    runs.remove('exp-pet-002')

    expect(runs.read('exp-pet-002')).toBeNull()
    expect(runs.read('other-flow')?.runId).toBe('run-2')
  })

  it('ignores a malformed record', () => {
    const storage = createFakeStorage()
    storage.setItem('ux-flows:analytics-run:exp-pet-002', '{"runId":42}')
    storage.setItem('ux-flows:analytics-run:other-flow', 'not json')
    const runs = createRunStorage(() => storage)

    expect(runs.read('exp-pet-002')).toBeNull()
    expect(runs.read('other-flow')).toBeNull()
  })

  it('clears every run record and nothing else', () => {
    const storage = createFakeStorage()
    storage.setItem('ux-flows:variant:exp-pet-002', 'a')
    const runs = createRunStorage(() => storage)
    runs.write('exp-pet-002', record)
    runs.write('other-flow', record)

    runs.clearAll()

    expect(runs.read('exp-pet-002')).toBeNull()
    expect(runs.read('other-flow')).toBeNull()
    expect(storage.getItem('ux-flows:variant:exp-pet-002')).toBe('a')
  })

  it.each([
    ['missing', () => undefined],
    ['throwing', throwingStorage],
  ])('never throws when storage is %s', (_, getStorage) => {
    const runs = createRunStorage(getStorage)

    expect(() => runs.write('exp-pet-002', record)).not.toThrow()
    expect(runs.read('exp-pet-002')).toBeNull()
    expect(() => runs.remove('exp-pet-002')).not.toThrow()
    expect(() => runs.clearAll()).not.toThrow()
  })
})
