import { fireEvent, render, screen } from '@testing-library/react-native'

import { EmptyPodsCard } from './EmptyPodsCard'

jest.mock('@gorhom/bottom-sheet', () => ({}))

const renderCard = (onAddPod = jest.fn(), onDismiss = jest.fn()) =>
  render(<EmptyPodsCard onAddPod={onAddPod} onDismiss={onDismiss} testID="card" />)

describe('EmptyPodsCard', () => {
  it('shows the title, the explanation and both actions', async () => {
    await renderCard()

    expect(screen.getByText('Create your first Pod')).toBeTruthy()
    expect(screen.getByText(/A Pod is a private little room for any info/)).toBeTruthy()
    expect(screen.getByText('Add Pod')).toBeTruthy()
    expect(screen.getByText('Maybe later')).toBeTruthy()
  })

  it('calls the add handler when Add Pod is pressed', async () => {
    const onAddPod = jest.fn()
    const onDismiss = jest.fn()
    await renderCard(onAddPod, onDismiss)

    await fireEvent.press(screen.getByText('Add Pod'))

    expect(onAddPod).toHaveBeenCalledTimes(1)
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('calls the dismiss handler when Maybe later is pressed', async () => {
    const onAddPod = jest.fn()
    const onDismiss = jest.fn()
    await renderCard(onAddPod, onDismiss)

    await fireEvent.press(screen.getByText('Maybe later'))

    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(onAddPod).not.toHaveBeenCalled()
    expect(screen.getByText('Create your first Pod')).toBeTruthy()
  })

  it('shows no Add Pod button without an add handler', async () => {
    const onDismiss = jest.fn()
    await render(<EmptyPodsCard onDismiss={onDismiss} testID="card" />)

    expect(screen.getByText('Create your first Pod')).toBeTruthy()
    expect(screen.queryByText('Add Pod')).toBeNull()

    await fireEvent.press(screen.getByText('Maybe later'))

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('exposes both actions as buttons labelled with their text', async () => {
    await renderCard()

    expect(screen.getByRole('button', { name: 'Add Pod' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Maybe later' })).toBeTruthy()
  })

  it('hides the icon from assistive technology', async () => {
    await renderCard()

    const holder = screen.getByTestId('card-icon', { includeHiddenElements: true })

    expect(holder.props.accessibilityElementsHidden).toBe(true)
    expect(holder.props.importantForAccessibility).toBe('no-hide-descendants')
  })
})
