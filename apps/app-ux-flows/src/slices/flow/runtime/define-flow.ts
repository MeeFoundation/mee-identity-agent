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

// An experiment is studied with participants and may compare variants; a showcase demonstrates one UX and is not tracked.
export type FlowKind = 'experiment' | 'showcase'

type FlowBase<S extends string, C extends ComponentEnvironment, I extends object> = {
  id: string
  // Design identifier such as `EXP-PET-002` or `SC-PET-001`, shown verbatim.
  code?: string
  titleKey: string
  descriptionKey?: string
  initialScreen: NoInfer<S>
  // `null` marks a screen that only some variants implement.
  screens: Record<S, ScreenComponent | null>
  components: C
  designFrames?: DesignFrames<NoInfer<S>>
  // Method syntax keeps concrete flows assignable to the registry's erased flow type.
  createStore(initialState?: I): FlowStore
}

type ExperimentDefinition<S extends string, C extends ComponentEnvironment, I extends object> = FlowBase<S, C, I> & {
  kind: 'experiment'
  variants?: Readonly<Record<string, VariantDefinition<NoInfer<S>, NoInfer<C>, NoInfer<I>>>>
  variantSelection?: VariantSelection
  // Explicit selection falls back to this variant, or to the first variant key when omitted.
  defaultVariant?: string
}

// `never` members keep these fields readable on the union while forbidding them on showcases.
type ShowcaseDefinition<S extends string, C extends ComponentEnvironment, I extends object> = FlowBase<S, C, I> & {
  kind: 'showcase'
  variants?: never
  variantSelection?: never
  defaultVariant?: never
}

export type FlowDefinition<S extends string, C extends ComponentEnvironment, I extends object> =
  | ExperimentDefinition<S, C, I>
  | ShowcaseDefinition<S, C, I>

export type AnyFlow = FlowDefinition<string, ComponentEnvironment, object>

// Overloads keep each flow's kind in its type, so spreading a flow into another stays the same kind.
export function defineFlow<S extends string, C extends ComponentEnvironment, I extends object>(
  flow: ExperimentDefinition<S, C, I>,
): ExperimentDefinition<S, C, I>
export function defineFlow<S extends string, C extends ComponentEnvironment, I extends object>(
  flow: ShowcaseDefinition<S, C, I>,
): ShowcaseDefinition<S, C, I>
export function defineFlow<S extends string, C extends ComponentEnvironment, I extends object>(
  flow: FlowDefinition<S, C, I>,
) {
  return flow
}
