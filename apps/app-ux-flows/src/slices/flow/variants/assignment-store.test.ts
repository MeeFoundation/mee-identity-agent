import { describe, expect, it } from 'vitest'

import { createAssignmentStore } from './assignment-store'

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

describe('assignment store', () => {
  it('reads and writes assignments per flow', () => {
    const storage = createFakeStorage()
    const store = createAssignmentStore(() => storage)

    expect(store.read('add-medication')).toBeNull()

    store.write('add-medication', 'control')
    store.write('other-flow', 'variant-b')

    expect(store.read('add-medication')).toBe('control')
    expect(store.read('other-flow')).toBe('variant-b')
    expect(createAssignmentStore(() => storage).read('add-medication')).toBe('control')
  })

  it('clears only variant assignment keys', () => {
    const storage = createFakeStorage()
    storage.setItem('unrelated', 'keep')
    const store = createAssignmentStore(() => storage)
    store.write('add-medication', 'control')

    store.clear()

    expect(store.read('add-medication')).toBeNull()
    expect(storage.getItem('unrelated')).toBe('keep')
  })

  it.each([
    ['missing', () => undefined],
    ['throwing', throwingStorage],
  ])('keeps assignments in memory when storage is %s', (_, getStorage) => {
    const store = createAssignmentStore(getStorage)

    store.write('add-medication', 'control')
    expect(store.read('add-medication')).toBe('control')

    store.clear()
    expect(store.read('add-medication')).toBeNull()
  })
})
