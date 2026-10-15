import { describe, expect, it } from 'vitest'

import { resolveDevMode } from './dev-mode'

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

const production = (search: string, storage: Storage | undefined) =>
  resolveDevMode({ devBuild: false, search, storage: () => storage })

describe('resolveDevMode', () => {
  it('is always on in a development build, without touching storage', () => {
    const { items, storage } = createStorage()

    expect(resolveDevMode({ devBuild: true, search: '?mode=off', storage: () => storage })).toEqual({
      fromUrl: false,
      on: true,
    })
    expect(items.size).toBe(0)
  })

  it('is off in a production build opened without the parameter', () => {
    expect(production('', createStorage().storage)).toEqual({ fromUrl: false, on: false })
  })

  it('turns on with mode=dev and stays on for later loads of the tab', () => {
    const { items, storage } = createStorage()

    expect(production('?mode=dev', storage)).toEqual({ fromUrl: true, on: true })
    expect(items.size).toBe(1)
    expect(production('', storage)).toEqual({ fromUrl: true, on: true })
  })

  it('turns off with mode=off', () => {
    const { items, storage } = createStorage()
    production('?mode=dev', storage)

    expect(production('?mode=off', storage)).toEqual({ fromUrl: false, on: false })
    expect(items.size).toBe(0)
    expect(production('', storage)).toEqual({ fromUrl: false, on: false })
  })

  it('ignores any other mode value', () => {
    const { items, storage } = createStorage()

    expect(production('?mode=preview', storage)).toEqual({ fromUrl: false, on: false })
    expect(items.size).toBe(0)
  })

  it('lasts only for the opened page when storage is missing or throws', () => {
    const throwing = {
      ...createStorage().storage,
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    }

    expect(production('?mode=dev', undefined)).toEqual({ fromUrl: true, on: true })
    expect(production('?mode=dev', throwing)).toEqual({ fromUrl: true, on: true })
    expect(production('', throwing)).toEqual({ fromUrl: false, on: false })
  })
})
