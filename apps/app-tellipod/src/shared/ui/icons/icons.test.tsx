import { render } from '@testing-library/react-native'
import type { ReactNode } from 'react'

import {
  BellFilledIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartsIcon,
  HomeFilledIcon,
  HomeIcon,
  type IconProps,
  ListNestedIcon,
  PeopleIcon,
  SearchIcon,
  ShieldLockIcon,
  TelliGuideIcon,
  ThreeDotsVerticalIcon,
} from '.'

const svgProps = async (Icon: (props: IconProps) => ReactNode) => {
  const { toJSON } = await render(<Icon />)
  const tree = toJSON()
  const root = Array.isArray(tree) ? tree[0] : tree
  return root?.props as Record<string, unknown>
}

describe('icons', () => {
  it.each([
    ['ChevronLeftIcon', ChevronLeftIcon, 24],
    ['PeopleIcon', PeopleIcon, 14],
    ['HeartsIcon', HeartsIcon, 14],
    ['ChevronRightIcon', ChevronRightIcon, 10],
    ['ThreeDotsVerticalIcon', ThreeDotsVerticalIcon, 24],
    ['SearchIcon', SearchIcon, 20],
    ['ShieldLockIcon', ShieldLockIcon, 14],
    ['HomeIcon', HomeIcon, 24],
    ['HomeFilledIcon', HomeFilledIcon, 24],
    ['TelliGuideIcon', TelliGuideIcon, 24],
    ['BellIcon', BellIcon, 24],
    ['BellFilledIcon', BellFilledIcon, 24],
    ['ListNestedIcon', ListNestedIcon, 24],
  ])('%s renders at its design size', async (_name, icon, size) => {
    const props = await svgProps(icon)
    expect(props.width ?? props.bbWidth).toEqual(size)
    expect(props.height ?? props.bbHeight).toEqual(size)
  })

  it('tints the icon with the color prop', async () => {
    const { toJSON } = await render(<ChevronLeftIcon color="#ff0000" />)
    const opaqueRed = 0xffff0000
    expect(JSON.stringify(toJSON())).toContain(`"payload":${opaqueRed}`)
  })
})
