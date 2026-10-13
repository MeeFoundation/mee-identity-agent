import { describe, expect, it, vi } from 'vitest'

import { createRandomId } from './random-id'

const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('createRandomId', () => {
  it('returns a UUID', () => {
    expect(createRandomId()).toMatch(uuidV4)
  })

  it('returns a different id each time', () => {
    expect(createRandomId()).not.toBe(createRandomId())
  })

  it('falls back to getRandomValues when randomUUID is missing', () => {
    const getRandomValues = vi.fn(<T extends ArrayBufferView | null>(array: T) =>
      globalThis.crypto.getRandomValues(array),
    )

    const id = createRandomId({ getRandomValues: getRandomValues as Crypto['getRandomValues'] })

    expect(id).toMatch(uuidV4)
    expect(getRandomValues).toHaveBeenCalledTimes(1)
  })
})
