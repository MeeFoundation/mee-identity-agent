import { describe, expect, it } from 'vitest'

import { createOpenGroupsStorage } from './open-groups'

const createStorage = () => {
  const items = new Map<string, string>()
  const storage: Storage = {
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
  return { items, storage }
}

describe('createOpenGroupsStorage', () => {
  it('reads back the groups it wrote', () => {
    const { storage } = createStorage()
    const openGroups = createOpenGroupsStorage(() => storage)

    expect(openGroups.read()).toEqual(new Set())
    openGroups.write(new Set(['showcase:SC-PET', 'experiment:EXP-PET']))

    expect(openGroups.read()).toEqual(new Set(['showcase:SC-PET', 'experiment:EXP-PET']))
  })

  it('reads none and writes nothing without storage', () => {
    const openGroups = createOpenGroupsStorage(() => undefined)

    openGroups.write(new Set(['showcase:SC-PET']))
    expect(openGroups.read()).toEqual(new Set())
  })

  it('reads none when storage throws', () => {
    const openGroups = createOpenGroupsStorage(() => {
      throw new Error('blocked')
    })

    expect(() => openGroups.write(new Set(['showcase:SC-PET']))).not.toThrow()
    expect(openGroups.read()).toEqual(new Set())
  })

  it('ignores stored data it does not recognise', () => {
    const { items, storage } = createStorage()
    const openGroups = createOpenGroupsStorage(() => storage)

    items.set('ux-flows:home-open-groups', '{not json')
    expect(openGroups.read()).toEqual(new Set())

    items.set('ux-flows:home-open-groups', JSON.stringify(['showcase:SC-PET', 3]))
    expect(openGroups.read()).toEqual(new Set())
  })
})
