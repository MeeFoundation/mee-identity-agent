import { createStore } from 'jotai'

import { userNameAtom } from '.'

describe('userNameAtom', () => {
  it('is empty by default', () => {
    expect(createStore().get(userNameAtom)).toBe('')
  })

  it('holds a set name', () => {
    const store = createStore()
    store.set(userNameAtom, 'Bogdan')
    expect(store.get(userNameAtom)).toBe('Bogdan')
  })
})
