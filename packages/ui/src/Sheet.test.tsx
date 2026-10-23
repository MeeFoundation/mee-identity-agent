import { fireEvent, render, screen, within } from '@testing-library/react-native'
import { BackHandler, Text } from 'react-native'

import { Sheet, type SheetProps } from './Sheet'

const mockModal = { dismiss: jest.fn(), present: jest.fn() }
let mockModalProps: Record<string, unknown> = {}
let mockScrollProps: Record<string, unknown> = {}

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react')
  const { Pressable, ScrollView, View } = require('react-native')

  const BottomSheetBackdrop = (props: { pressBehavior: string }) =>
    React.createElement(Pressable, {
      onPress: () => {
        if (props.pressBehavior === 'close') (mockModalProps.onDismiss as () => void)()
      },
      testID: 'backdrop',
    })

  const BottomSheetModal = React.forwardRef(
    (
      props: {
        children: unknown
        backdropComponent: (backdropProps: object) => unknown
        containerComponent: React.ComponentType<React.PropsWithChildren>
        handleComponent: React.ComponentType
      },
      ref: React.Ref<unknown>,
    ) => {
      mockModalProps = props
      React.useImperativeHandle(ref, () => mockModal)
      const Container = props.containerComponent
      const Handle = props.handleComponent
      return React.createElement(
        Container,
        null,
        props.backdropComponent({}),
        React.createElement(Handle),
        props.children,
      )
    },
  )

  const BottomSheetScrollView = (props: { children: unknown; testID: string }) => {
    mockScrollProps = props
    return React.createElement(ScrollView, { testID: props.testID }, props.children)
  }

  return { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView, View }
})

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}))

type JsonNode = ReturnType<typeof screen.toJSON>

const hasProp = (node: JsonNode, prop: string): boolean => {
  if (!node) return false
  if (Array.isArray(node)) return node.some((child) => hasProp(child, prop))
  if (node.props[prop]) return true
  return (node.children ?? []).some((child) => typeof child !== 'string' && hasProp(child, prop))
}

type HardwareBackHandler = () => boolean | null | undefined

let backHandlers: HardwareBackHandler[] = []
const removeBackListener = jest.fn()

const renderSheet = async (props: Partial<SheetProps> = {}) => {
  const onDismiss = props.onDismiss ?? jest.fn()
  const element = (next: Partial<SheetProps> = {}) => (
    <Sheet onDismiss={onDismiss} title="Edit form info" visible {...props} {...next} testID="sheet">
      {props.children ?? <Text>Form body</Text>}
    </Sheet>
  )
  const view = await render(element())
  return { onDismiss, rerender: (next: Partial<SheetProps>) => view.rerender(element(next)) }
}

beforeEach(() => {
  mockModal.dismiss.mockClear()
  mockModal.present.mockClear()
  removeBackListener.mockClear()
  backHandlers = []
  jest.spyOn(BackHandler, 'addEventListener').mockImplementation((_event, handler) => {
    backHandlers.push(handler as HardwareBackHandler)
    return { remove: removeBackListener }
  })
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Sheet layout', () => {
  it('shows the title, the description and the children', async () => {
    await renderSheet({ description: 'A personal detail everyone can see.' })

    expect(screen.getByText('Edit form info')).toBeTruthy()
    expect(screen.getByText('A personal detail everyone can see.')).toBeTruthy()
    expect(screen.getByText('Form body')).toBeTruthy()
  })

  it('reserves no description row when there is no description', async () => {
    await renderSheet()

    expect(within(screen.getByTestId('sheet-header')).getAllByText(/./)).toHaveLength(1)
  })

  it('renders the children unchanged inside the scrollable content, and the header outside it', async () => {
    await renderSheet({ description: 'Hint' })

    const content = screen.getByTestId('sheet-content')
    expect(within(content).getByText('Form body')).toBeTruthy()
    expect(within(content).queryByText('Edit form info')).toBeNull()
    expect(within(content).queryByText('Hint')).toBeNull()
    expect(within(screen.getByTestId('sheet-header')).queryByText('Form body')).toBeNull()
  })

  it('sizes to its content and never grows above the top safe-area inset plus a gap', async () => {
    await renderSheet()

    expect(mockModalProps.enableDynamicSizing).toBe(true)
    expect(mockModalProps.maxDynamicContentSize).toBeUndefined()
    expect(mockModalProps.topInset).toBe(47 + 16)
  })

  it('pads the bottom of the content by the safe-area inset', async () => {
    await renderSheet()

    expect(mockScrollProps.contentContainerStyle).toEqual(
      expect.arrayContaining([expect.objectContaining({ paddingBottom: 50 })]),
    )
  })

  it('uses the library keyboard handling', async () => {
    await renderSheet()

    expect(mockModalProps.keyboardBehavior).toBe('interactive')
    expect(mockModalProps.keyboardBlurBehavior).toBe('restore')
  })
})

describe('Sheet visibility', () => {
  it('presents the sheet while visible and dismisses it when hidden', async () => {
    const { rerender } = await renderSheet()
    expect(mockModal.present).toHaveBeenCalledTimes(1)

    await rerender({ visible: false })
    expect(mockModal.dismiss).toHaveBeenCalledTimes(1)
  })

  it('neither presents nor dismisses while it has never been shown', async () => {
    await renderSheet({ visible: false })

    expect(mockModal.present).not.toHaveBeenCalled()
    expect(mockModal.dismiss).not.toHaveBeenCalled()
  })

  it('does not dismiss again when the consumer hides it after the user already closed it', async () => {
    const { onDismiss, rerender } = await renderSheet()

    ;(mockModalProps.onDismiss as () => void)()
    await rerender({ visible: false })

    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(mockModal.dismiss).not.toHaveBeenCalled()
  })

  it('can be shown again after it was hidden', async () => {
    const { rerender } = await renderSheet()

    await rerender({ visible: false })
    ;(mockModalProps.onDismiss as () => void)()
    await rerender({ visible: true })

    expect(mockModal.present).toHaveBeenCalledTimes(2)
  })

  it('does not call onDismiss when the consumer closes it', async () => {
    const { onDismiss, rerender } = await renderSheet()

    await rerender({ visible: false })
    ;(mockModalProps.onDismiss as () => void)()

    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('calls onDismiss once when the user closes it', async () => {
    const { onDismiss } = await renderSheet()

    ;(mockModalProps.onDismiss as () => void)()

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})

describe('Sheet dismissal', () => {
  it('allows dragging down and closes on a backdrop tap by default', async () => {
    const { onDismiss } = await renderSheet()

    expect(mockModalProps.enablePanDownToClose).toBe(true)
    await fireEvent.press(screen.getByTestId('backdrop'))

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('disables dragging and the backdrop while not dismissible', async () => {
    const { onDismiss } = await renderSheet({ dismissible: false })

    expect(mockModalProps.enablePanDownToClose).toBe(false)
    await fireEvent.press(screen.getByTestId('backdrop'))

    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('calls onDismiss once on the Android back button and consumes the press', async () => {
    const { onDismiss } = await renderSheet()

    expect(backHandlers).toHaveLength(1)
    expect(backHandlers[0]()).toBe(true)

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('still calls onDismiss on the back button while not dismissible', async () => {
    const { onDismiss } = await renderSheet({ dismissible: false })

    expect(backHandlers[0]()).toBe(true)

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('listens to the back button only while visible', async () => {
    const { rerender } = await renderSheet()
    expect(backHandlers).toHaveLength(1)

    await rerender({ visible: false })
    expect(removeBackListener).toHaveBeenCalledTimes(1)
    expect(backHandlers).toHaveLength(1)
  })

  it('does not listen to the back button while hidden', async () => {
    await renderSheet({ visible: false })

    expect(backHandlers).toHaveLength(0)
  })
})

describe('Sheet accessibility', () => {
  it('exposes the grabber as a Dismiss button that calls onDismiss', async () => {
    const { onDismiss } = await renderSheet()

    await fireEvent.press(screen.getByRole('button', { name: 'Dismiss' }))

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('shows no grabber button and keeps the header space while not dismissible', async () => {
    await renderSheet({ dismissible: false })

    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull()
    expect(screen.queryByTestId('sheet-grabber')).toBeNull()
    expect(screen.getByTestId('sheet-grabber-space')).toBeTruthy()
    expect(screen.getByText('Edit form info')).toBeTruthy()
  })

  it('uses a custom grabber label', async () => {
    await renderSheet({ dismissLabel: 'Close' })

    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull()
  })

  it('exposes the title as a header', async () => {
    await renderSheet()

    expect(screen.getByRole('header', { name: 'Edit form info' })).toBeTruthy()
  })

  it('marks the sheet container as modal so the content behind is hidden from screen readers', async () => {
    await renderSheet()

    expect(hasProp(screen.toJSON(), 'accessibilityViewIsModal')).toBe(true)
  })
})
