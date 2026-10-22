import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'

import { type TabItem, Tabs } from './Tabs'

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native')
  return {
    __esModule: true,
    default: { View },
    Easing: { cubic: undefined, out: () => undefined },
    ReduceMotion: { System: 'system' },
    useAnimatedStyle: (factory: () => object) => factory(),
    useSharedValue: (initial: number) => ({ value: initial }),
    withTiming: (target: number) => target,
  }
})

const items: TabItem[] = [
  { key: 'one', label: 'First' },
  { key: 'two', label: 'Second' },
  { key: 'three', label: 'Third' },
]

type JsonNode = ReturnType<typeof screen.toJSON>

const hasRole = (node: JsonNode, role: string): boolean => {
  if (!node) return false
  if (Array.isArray(node)) return node.some((child) => hasRole(child, role))
  if (node.props.accessibilityRole === role) return true
  return (node.children ?? []).some((child) => typeof child !== 'string' && hasRole(child, role))
}

describe('Tabs', () => {
  it('exposes a tab list with one tab per item and the selected state', async () => {
    await render(<Tabs items={items} onValueChange={jest.fn()} value="two" />)

    expect(hasRole(screen.toJSON(), 'tablist')).toBe(true)
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { name: 'Second', selected: true })).toBeTruthy()
    expect(screen.getByRole('tab', { name: 'First', selected: false })).toBeTruthy()
  })

  it('reports the key of a pressed unselected tab', async () => {
    const onValueChange = jest.fn()
    await render(<Tabs items={items} onValueChange={onValueChange} value="one" />)

    await fireEvent.press(screen.getByRole('tab', { name: 'Third' }))

    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith('three')
  })

  it('does not report a press on the selected tab', async () => {
    const onValueChange = jest.fn()
    await render(<Tabs items={items} onValueChange={onValueChange} value="one" />)

    await fireEvent.press(screen.getByRole('tab', { name: 'First' }))

    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('renders left and right icons around the label', async () => {
    const withIcons: TabItem[] = [
      { iconLeft: <Text>left-icon</Text>, iconRight: <Text>right-icon</Text>, key: 'one', label: 'First' },
    ]
    await render(<Tabs items={withIcons} onValueChange={jest.fn()} value="one" />)

    expect(screen.getByText('left-icon')).toBeTruthy()
    expect(screen.getByText('right-icon')).toBeTruthy()
  })
})
