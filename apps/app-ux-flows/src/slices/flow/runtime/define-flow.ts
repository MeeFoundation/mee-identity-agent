import type { createStore } from 'jotai'
import type { ComponentType, JSXElementConstructor } from 'react'

export type ScreenComponent = ComponentType

export type ComponentEnvironment = Record<string, JSXElementConstructor<never>>

export type FlowStore = ReturnType<typeof createStore>

export type DesignFrame = {
  name: string
  url: string
}

type DesignFrames<S extends string> = Partial<Record<S, DesignFrame>>

type VariantDefinition<S extends string, C extends ComponentEnvironment, I extends object> = {
  nameKey: string
  descriptionKey?: string
  // Design identifier such as `EXP-PET-002-A`, shown verbatim.
  code?: string
  components?: Partial<C>
  screens?: Partial<Record<S, ScreenComponent>>
  initialState?: I
  designFrames?: DesignFrames<S>
}

type VariantSelection = 'explicit' | 'automatic'

export type FlowDefinition<S extends string, C extends ComponentEnvironment, I extends object> = {
  id: string
  titleKey: string
  descriptionKey?: string
  // Design identifier such as `EXP-PET-002`, shown verbatim.
  code?: string
  initialScreen: NoInfer<S>
  // `null` marks a screen that only some variants implement.
  screens: Record<S, ScreenComponent | null>
  components: C
  designFrames?: DesignFrames<NoInfer<S>>
  variants?: Readonly<Record<string, VariantDefinition<NoInfer<S>, NoInfer<C>, NoInfer<I>>>>
  variantSelection?: VariantSelection
  // Explicit selection falls back to this variant, or to the first variant key when omitted.
  defaultVariant?: string
  // Method syntax keeps concrete flows assignable to the registry's erased flow type.
  createStore(initialState?: I): FlowStore
}

export type AnyFlow = FlowDefinition<string, ComponentEnvironment, object>

export const defineFlow = <S extends string, C extends ComponentEnvironment, I extends object>(
  flow: FlowDefinition<S, C, I>,
) => flow
