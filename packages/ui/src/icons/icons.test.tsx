import { render } from '@testing-library/react-native'
import type { ReactElement, ReactNode } from 'react'

import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Diagram3Icon,
  ExclamationCircleIcon,
  ExclamationOctagonIcon,
  ExclamationTriangleIcon,
  FolderPlusIcon,
  type IconProps,
  InfoCircleIcon,
  PaperclipIcon,
  PencilIcon,
  PeopleIcon,
  PersonVideoIcon,
  PlusIcon,
  QuestionCircleIcon,
  SearchIcon,
  XIcon,
} from '.'

const svgProps = async (element: ReactElement) => {
  const { toJSON } = await render(element)
  const tree = toJSON()
  const root = Array.isArray(tree) ? tree[0] : tree
  return root?.props as Record<string, unknown>
}

const designSizes: [string, (props: IconProps) => ReactNode, number][] = [
  ['PencilIcon', PencilIcon, 16],
  ['PlusIcon', PlusIcon, 24],
  ['FolderPlusIcon', FolderPlusIcon, 24],
  ['PaperclipIcon', PaperclipIcon, 18],
  ['Diagram3Icon', Diagram3Icon, 18],
  ['PeopleIcon', PeopleIcon, 18],
  ['PersonVideoIcon', PersonVideoIcon, 18],
  ['ChevronDownIcon', ChevronDownIcon, 16],
  ['ChevronRightIcon', ChevronRightIcon, 16],
  ['SearchIcon', SearchIcon, 16],
  ['ExclamationCircleIcon', ExclamationCircleIcon, 14],
  ['QuestionCircleIcon', QuestionCircleIcon, 16],
  ['InfoCircleIcon', InfoCircleIcon, 16],
  ['CheckCircleIcon', CheckCircleIcon, 16],
  ['ExclamationOctagonIcon', ExclamationOctagonIcon, 16],
  ['ExclamationTriangleIcon', ExclamationTriangleIcon, 16],
  ['XIcon', XIcon, 20],
]

describe('icons', () => {
  it.each(designSizes)('%s renders at its design size', async (_name, Icon, size) => {
    const props = await svgProps(<Icon />)

    expect(props.width ?? props.bbWidth).toEqual(size)
    expect(props.height ?? props.bbHeight).toEqual(size)
  })

  it.each(designSizes)('%s renders at a custom size', async (_name, Icon) => {
    const props = await svgProps(<Icon size={32} />)

    expect(props.width ?? props.bbWidth).toEqual(32)
    expect(props.height ?? props.bbHeight).toEqual(32)
  })

  it.each(designSizes)('%s takes a custom colour', async (_name, Icon) => {
    const { toJSON } = await render(<Icon color="#ff0000" />)
    const opaqueRed = 0xffff0000

    expect(JSON.stringify(toJSON())).toContain(`"payload":${opaqueRed}`)
  })
})
