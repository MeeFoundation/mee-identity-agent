import { render, screen } from '@testing-library/react-native'

import { PodCardSkeletonList } from './PodCardSkeletonList'

const hiddenOptions = { includeHiddenElements: true }

describe('PodCardSkeletonList', () => {
  it('renders the requested number of placeholder rows', async () => {
    await render(<PodCardSkeletonList count={3} testID="skeleton" />)

    expect(screen.getAllByTestId(/^skeleton-row-/, hiddenOptions)).toHaveLength(3)
  })

  it('announces one busy loading label', async () => {
    await render(<PodCardSkeletonList count={3} testID="skeleton" />)

    const wrapper = screen.getByLabelText('Loading pods')

    expect(wrapper.props.accessibilityState).toEqual({ busy: true })
    expect(screen.getAllByLabelText('Loading pods')).toHaveLength(1)
  })

  it('hides the placeholder rows from assistive technology', async () => {
    await render(<PodCardSkeletonList count={2} testID="skeleton" />)

    expect(screen.queryAllByTestId(/^skeleton-row-/)).toHaveLength(0)
    for (const row of screen.getAllByTestId(/^skeleton-row-/, hiddenOptions)) {
      expect(row.props.accessibilityElementsHidden).toBe(true)
      expect(row.props.importantForAccessibility).toBe('no-hide-descendants')
    }
  })

  it('renders nothing visible for a count of zero', async () => {
    await render(<PodCardSkeletonList count={0} testID="skeleton" />)

    expect(screen.queryAllByTestId(/^skeleton-row-/, hiddenOptions)).toHaveLength(0)
  })
})
