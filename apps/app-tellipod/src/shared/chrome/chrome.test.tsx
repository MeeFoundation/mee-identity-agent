import { act, renderHook } from '@testing-library/react-native'
import { createStore, Provider } from 'jotai'
import type { ReactNode } from 'react'

import { chromeAtom, DEFAULT_CHROME, type PodHeaderConfig, unreadNotificationsAtom, useAppChrome } from '.'

const setup = () => {
  const store = createStore()
  const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>
  return { store, wrapper }
}

describe('chromeAtom', () => {
  it('defaults to no header and a visible footer with no owner', async () => {
    const { store } = setup()
    expect(store.get(chromeAtom)).toEqual({ footer: 'visible', header: 'none', owner: null })
  })

  it('keeps unread count independent of chrome', async () => {
    const { store } = setup()
    store.set(unreadNotificationsAtom, 3)
    expect(store.get(chromeAtom)).toEqual(DEFAULT_CHROME)

    store.set(chromeAtom, { footer: 'hidden', header: 'pod', owner: 'x' })
    expect(store.get(unreadNotificationsAtom)).toBe(3)
  })
})

describe('useAppChrome', () => {
  it('applies the declared chrome while focused', async () => {
    const { store, wrapper } = setup()
    await renderHook(() => useAppChrome({ footer: 'hidden', header: 'home' }), { wrapper })
    expect(store.get(chromeAtom)).toMatchObject({ footer: 'hidden', header: 'home' })
  })

  it('defaults the footer to visible when only a header is declared', async () => {
    const { store, wrapper } = setup()
    await renderHook(() => useAppChrome({ header: 'back-search' }), { wrapper })
    expect(store.get(chromeAtom)).toMatchObject({ footer: 'visible', header: 'back-search' })
  })

  it('releases to the default when the focused screen blurs and nothing else took over', async () => {
    const { store, wrapper } = setup()
    const a = await renderHook(() => useAppChrome({ header: 'home' }), { wrapper })
    await act(async () => a.unmount())
    expect(store.get(chromeAtom)).toEqual(DEFAULT_CHROME)
  })

  it('keeps B chrome when A blurs after B gained focus', async () => {
    const { store, wrapper } = setup()
    const a = await renderHook(() => useAppChrome({ header: 'home' }), { wrapper })
    await renderHook(() => useAppChrome({ header: 'back-search' }), { wrapper })
    expect(store.get(chromeAtom).header).toBe('back-search')

    await act(async () => a.unmount())
    expect(store.get(chromeAtom).header).toBe('back-search')
  })

  it('applies chrome again when a screen regains focus after another blurred', async () => {
    const { store, wrapper } = setup()
    const b = await renderHook(() => useAppChrome({ footer: 'hidden', header: 'pod' }), { wrapper })
    await act(async () => b.unmount())
    expect(store.get(chromeAtom)).toEqual(DEFAULT_CHROME)

    await renderHook(() => useAppChrome({ header: 'home' }), { wrapper })
    expect(store.get(chromeAtom)).toMatchObject({ footer: 'visible', header: 'home' })
  })
})

describe('useAppChrome pod payload', () => {
  const podConfig = (tab: PodHeaderConfig['tab'] = 'notes'): PodHeaderConfig => ({
    breadcrumb: [{ icon: 'people', label: 'People' }, { label: 'Immediate Family' }],
    onTabChange: jest.fn(),
    tab,
    title: 'About Sofia',
  })

  it('applies the pod payload on focus', async () => {
    const { store, wrapper } = setup()
    const pod = podConfig()
    await renderHook(() => useAppChrome({ header: 'pod', pod }), { wrapper })
    expect(store.get(chromeAtom).pod).toBe(pod)
  })

  it('updates the payload without releasing chrome when it changes', async () => {
    const { store, wrapper } = setup()
    const hook = await renderHook<void, { pod: PodHeaderConfig }>(({ pod }) => useAppChrome({ header: 'pod', pod }), {
      initialProps: { pod: podConfig('notes') },
      wrapper,
    })
    const owner = store.get(chromeAtom).owner

    const next = podConfig('chat')
    await hook.rerender({ pod: next })
    expect(store.get(chromeAtom)).toMatchObject({ header: 'pod', owner, pod: next })
  })

  it('releases the payload when the screen blurs', async () => {
    const { store, wrapper } = setup()
    const hook = await renderHook(() => useAppChrome({ header: 'pod', pod: podConfig() }), { wrapper })
    await act(async () => hook.unmount())
    expect(store.get(chromeAtom)).toEqual(DEFAULT_CHROME)
  })

  it('does not overwrite the chrome of a screen that gained focus later', async () => {
    const { store, wrapper } = setup()
    const a = await renderHook<void, { pod: PodHeaderConfig }>(({ pod }) => useAppChrome({ header: 'pod', pod }), {
      initialProps: { pod: podConfig('notes') },
      wrapper,
    })
    await renderHook(() => useAppChrome({ header: 'home' }), { wrapper })

    await a.rerender({ pod: podConfig('chat') })
    expect(store.get(chromeAtom)).toMatchObject({ header: 'home', pod: undefined })
  })
})
