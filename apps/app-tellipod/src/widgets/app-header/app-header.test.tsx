import { act, fireEvent, render, screen } from '@testing-library/react-native'
import { useRouter } from 'expo-router'
import { createStore, Provider } from 'jotai'

import { AppHeader } from './app-header'
import { chromeAtom, DEFAULT_CHROME, type HeaderVariant, type PodHeaderConfig, type PodTab } from '@/shared/chrome'
import { userNameAtom } from '@/shared/user'

const mounts = { content: 0, surface: 0 }

jest.mock('expo-linear-gradient', () => {
  const { useEffect } = require('react')
  const { View } = require('react-native')
  return {
    LinearGradient: (props: object) => {
      useEffect(() => {
        mounts.surface += 1
      }, [])
      return <View {...props} />
    },
  }
})

jest.mock('./search-field', () => {
  const { useEffect } = require('react')
  const actual = jest.requireActual('./search-field')
  return {
    SearchField: () => {
      useEffect(() => {
        mounts.content += 1
      }, [])
      return <actual.SearchField />
    },
  }
})

beforeEach(() => {
  mounts.content = 0
  mounts.surface = 0
})

const podConfig = (overrides: Partial<PodHeaderConfig> = {}): PodHeaderConfig => ({
  breadcrumb: [{ icon: 'people', label: 'People' }, { label: 'Immediate Family' }],
  onTabChange: jest.fn(),
  tab: 'notes',
  title: 'About Sofia',
  ...overrides,
})

const renderHeader = async (header: HeaderVariant, pod?: PodHeaderConfig, back = jest.fn(), userName = '') => {
  jest.mocked(useRouter).mockReturnValue({ back } as unknown as ReturnType<typeof useRouter>)
  const store = createStore()
  store.set(chromeAtom, { ...DEFAULT_CHROME, header, pod })
  store.set(userNameAtom, userName)
  await render(
    <Provider store={store}>
      <AppHeader />
    </Provider>,
  )
  return { back, store }
}

describe('AppHeader', () => {
  it('renders nothing for the none variant', async () => {
    await renderHeader('none')
    expect(screen.toJSON()).toBeNull()
  })

  it('renders a named greeting, avatar letter, privacy note and search field for the home variant', async () => {
    await renderHeader('home', undefined, jest.fn(), 'Bogdan')
    expect(screen.getByText('Welcome, Bogdan')).toBeTruthy()
    expect(screen.getByText('B')).toBeTruthy()
    expect(screen.getByText('Device-to-device sharing, pod members only.')).toBeTruthy()
    expect(screen.getByPlaceholderText('Search, or ask Telli...')).toBeTruthy()
    expect(screen.queryByLabelText('Back')).toBeNull()
  })

  it('renders a plain greeting without a name for the home variant', async () => {
    await renderHeader('home')
    expect(screen.getByText('Welcome')).toBeTruthy()
    expect(screen.queryByText('B')).toBeNull()
  })

  it('truncates a long greeting and privacy note on the home variant', async () => {
    await renderHeader('home', undefined, jest.fn(), 'Bogdan with a very long name')
    expect(screen.getByText('Welcome, Bogdan with a very long name').props.numberOfLines).toBe(1)
    expect(screen.getByText('Device-to-device sharing, pod members only.').props.numberOfLines).toBe(1)
  })

  it('does not accept text in the search field', async () => {
    await renderHeader('home')
    expect(screen.getByPlaceholderText('Search, or ask Telli...').props.editable).toBe(false)
  })

  it('renders a back control and the search field for the back-search variant', async () => {
    await renderHeader('back-search')
    expect(screen.getByLabelText('Back')).toBeTruthy()
    expect(screen.getByPlaceholderText('Search, or ask Telli...')).toBeTruthy()
    expect(screen.queryByText('Welcome')).toBeNull()
  })

  it('navigates back from the back-search variant', async () => {
    const { back } = await renderHeader('back-search')
    await fireEvent.press(screen.getByLabelText('Back'))
    expect(back).toHaveBeenCalledTimes(1)
  })

  it('switches variant when chrome changes', async () => {
    const { store } = await renderHeader('home')
    await act(async () => store.set(chromeAtom, { ...DEFAULT_CHROME, header: 'back-search' }))
    expect(screen.queryByText('Welcome')).toBeNull()
    expect(screen.getByLabelText('Back')).toBeTruthy()
  })
})

describe('AppHeader transitions', () => {
  it('keeps one surface while the variant changes between home, back-search and pod', async () => {
    const { store } = await renderHeader('home')
    await act(async () => store.set(chromeAtom, { ...DEFAULT_CHROME, header: 'back-search' }))
    await act(async () => store.set(chromeAtom, { ...DEFAULT_CHROME, header: 'pod', pod: podConfig() }))
    expect(screen.getByText('About Sofia')).toBeTruthy()
    expect(mounts.surface).toBe(1)
  })

  it('mounts the incoming content when the variant changes', async () => {
    const { store } = await renderHeader('home')
    await act(async () => store.set(chromeAtom, { ...DEFAULT_CHROME, header: 'back-search' }))
    expect(mounts.content).toBe(2)
  })

  it('mounts a new surface when the header returns from none', async () => {
    const { store } = await renderHeader('home')
    await act(async () => store.set(chromeAtom, DEFAULT_CHROME))
    expect(screen.toJSON()).toBeNull()
    await act(async () => store.set(chromeAtom, { ...DEFAULT_CHROME, header: 'home' }))
    expect(mounts.surface).toBe(2)
  })

  it('does not remount content when a value inside the variant changes', async () => {
    const { store } = await renderHeader('home', undefined, jest.fn(), 'Bogdan')
    await act(async () => store.set(userNameAtom, 'Sofia'))
    expect(screen.getByText('Welcome, Sofia')).toBeTruthy()
    expect(mounts.content).toBe(1)
    expect(mounts.surface).toBe(1)
  })

  it('does not remount content when the pod tab changes', async () => {
    const { store } = await renderHeader('pod', podConfig())
    await act(async () => store.set(chromeAtom, { ...DEFAULT_CHROME, header: 'pod', pod: podConfig({ tab: 'chat' }) }))
    expect(screen.getByRole('tab', { name: 'Chat', selected: true })).toBeTruthy()
    expect(mounts.surface).toBe(1)
  })
})

describe('AppHeader pod variant', () => {
  it('renders back, title, breadcrumb, overflow action and tabs', async () => {
    await renderHeader('pod', podConfig())
    expect(screen.getByLabelText('Back')).toBeTruthy()
    expect(screen.getByText('About Sofia')).toBeTruthy()
    expect(screen.getByText('People')).toBeTruthy()
    expect(screen.getByText('Immediate Family')).toBeTruthy()
    expect(screen.getByLabelText('Menu')).toBeTruthy()
    expect(screen.getByText('Notes')).toBeTruthy()
    expect(screen.getByText('Chat')).toBeTruthy()
    expect(screen.getByText('Info')).toBeTruthy()
  })

  it('renders nothing when the pod payload is missing', async () => {
    await renderHeader('pod')
    expect(screen.toJSON()).toBeNull()
  })

  it('shows the title initial when there is no avatar image', async () => {
    await renderHeader('pod', podConfig())
    expect(screen.getByText('A')).toBeTruthy()
  })

  it('shows the avatar image when one is provided', async () => {
    await renderHeader('pod', podConfig({ avatarUri: 'https://example.com/sofia.png' }))
    expect(screen.queryByText('A')).toBeNull()
  })

  it('truncates a long title to a single line', async () => {
    await renderHeader('pod', podConfig({ title: 'A very long pod title that cannot fit' }))
    expect(screen.getByText('A very long pod title that cannot fit').props.numberOfLines).toBe(1)
  })

  it('navigates back through the router', async () => {
    const { back } = await renderHeader('pod', podConfig())
    await fireEvent.press(screen.getByLabelText('Back'))
    expect(back).toHaveBeenCalledTimes(1)
  })

  it('marks only the selected tab as selected', async () => {
    await renderHeader('pod', podConfig({ tab: 'chat' }))
    const selected = screen.getAllByRole('tab', { selected: true })
    expect(selected).toHaveLength(1)
    expect(screen.getByRole('tab', { name: 'Chat', selected: true })).toBeTruthy()
  })

  it('reports the pressed tab without changing the selection itself', async () => {
    const onTabChange = jest.fn<void, [PodTab]>()
    await renderHeader('pod', podConfig({ onTabChange }))
    await fireEvent.press(screen.getByText('Chat'))
    expect(onTabChange).toHaveBeenCalledWith('chat')
    expect(screen.getByRole('tab', { name: 'Notes', selected: true })).toBeTruthy()
  })

  it('applies a selection the screen accepts', async () => {
    const { store } = await renderHeader('pod', podConfig())
    await act(async () => store.set(chromeAtom, { ...DEFAULT_CHROME, header: 'pod', pod: podConfig({ tab: 'chat' }) }))
    expect(screen.getByRole('tab', { name: 'Chat', selected: true })).toBeTruthy()
  })

  it('does not report a press on the selected tab', async () => {
    const onTabChange = jest.fn()
    await renderHeader('pod', podConfig({ onTabChange, tab: 'info' }))
    await fireEvent.press(screen.getByText('Info'))
    expect(onTabChange).not.toHaveBeenCalled()
  })
})
