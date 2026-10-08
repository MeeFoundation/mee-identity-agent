import type { ComponentProps, ComponentType } from 'react'

import { ContinueButton } from './components/continue-button'
import { TextBlock } from './components/text-block'
import { TextInputField } from './components/text-input-field'
import type { FlowComponentRuntimeProps, ScreenBlock } from './model'

const componentRegistry = {
  'continue-button': ContinueButton,
  text: TextBlock,
  'text-input': TextInputField,
}

export type ComponentKey = keyof typeof componentRegistry

export type ComponentAuthoredProps<K extends ComponentKey> = Omit<
  ComponentProps<(typeof componentRegistry)[K]>,
  keyof FlowComponentRuntimeProps
>

export const resolveBlockComponent = (block: ScreenBlock) =>
  // TS cannot correlate `block.component` with `block.props` across the union, so widen the props here.
  componentRegistry[block.component] as ComponentType<FlowComponentRuntimeProps & ScreenBlock['props']>
