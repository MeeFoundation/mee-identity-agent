import { fireEvent, render, screen } from '@testing-library/react-native'
import { createStore, Provider } from 'jotai'

import { OnboardingScreen, onboardedAtom } from '.'
import { chromeAtom } from '@/shared/chrome'
import { mmkvStorage } from '@/shared/storage'

jest.mock('@/shared/storage', () => {
  const data = new Map<string, string>()
  return {
    mmkvStorage: {
      getItem: (key: string) => data.get(key) ?? null,
      removeItem: (key: string) => data.delete(key),
      setItem: (key: string, value: string) => data.set(key, value),
    },
  }
})

beforeEach(() => {
  mmkvStorage.removeItem('onboarding.completed')
})

describe('onboardedAtom', () => {
  it('is false on a fresh install', () => {
    expect(createStore().get(onboardedAtom)).toBe(false)
  })

  it('reads a persisted completion synchronously on first read', () => {
    jest.isolateModules(() => {
      const storage = require('@/shared/storage') as typeof import('@/shared/storage')
      storage.mmkvStorage.setItem('onboarding.completed', 'true')
      const model = require('./model') as typeof import('./model')
      expect(createStore().get(model.onboardedAtom)).toBe(true)
    })
  })

  it('persists completion under onboarding.completed', () => {
    const store = createStore()
    store.set(onboardedAtom, true)
    expect(mmkvStorage.getItem('onboarding.completed')).toBe('true')
  })
})

describe('OnboardingScreen', () => {
  const renderScreen = async () => {
    const store = createStore()
    await render(
      <Provider store={store}>
        <OnboardingScreen />
      </Provider>,
    )
    return store
  }

  it('shows the localized title and Start button', async () => {
    await renderScreen()
    expect(screen.getByText('Onboarding')).toBeTruthy()
    expect(screen.getByText('Start')).toBeTruthy()
  })

  it('declares no header and a hidden footer', async () => {
    const store = await renderScreen()
    expect(store.get(chromeAtom)).toMatchObject({ footer: 'hidden', header: 'none' })
  })

  it('marks onboarding completed and persists it when Start is pressed', async () => {
    const store = await renderScreen()
    expect(store.get(onboardedAtom)).toBe(false)

    await fireEvent.press(screen.getByText('Start'))

    expect(store.get(onboardedAtom)).toBe(true)
    expect(mmkvStorage.getItem('onboarding.completed')).toBe('true')
  })
})
