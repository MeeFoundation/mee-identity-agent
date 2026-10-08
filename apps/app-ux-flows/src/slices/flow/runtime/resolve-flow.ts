import type { ComponentEnvironment, DesignFrame, FlowDefinition, FlowStore, ScreenComponent } from './define-flow'

export type ResolvedFlow<S extends string, C extends ComponentEnvironment, I extends object> = {
  flowId: string
  variantId: string | null
  code: string | null
  variantCode: string | null
  titleKey: string
  descriptionKey: string | null
  initialScreen: S
  screens: Partial<Record<S, ScreenComponent>>
  components: C
  designFrames: Partial<Record<S, DesignFrame>>
  createStore(initialState?: I): FlowStore
}

const cache = new WeakMap<object, Map<string | null, unknown>>()

const resolveScreens = <S extends string>(screens: Record<S, ScreenComponent | null>) => {
  const resolved: Partial<Record<S, ScreenComponent>> = {}
  for (const [screenId, screen] of Object.entries<ScreenComponent | null>(screens)) {
    if (screen) resolved[screenId as S] = screen
  }
  return resolved
}

const createResolvedFlow = <S extends string, C extends ComponentEnvironment, I extends object>(
  flow: FlowDefinition<S, C, I>,
  variantId: string | null,
): ResolvedFlow<S, C, I> => {
  const { variants } = flow
  const hasVariants = variants !== undefined && Object.keys(variants).length > 0

  if (variantId === null && hasVariants) {
    throw new Error(`Flow "${flow.id}" declares variants, so a variant id is required`)
  }
  if (variantId !== null && !(variants && Object.hasOwn(variants, variantId))) {
    throw new Error(`Flow "${flow.id}" has no variant "${variantId}"`)
  }

  const variant = variantId === null ? undefined : variants?.[variantId]
  const screens = resolveScreens({ ...flow.screens, ...variant?.screens })

  if (!Object.hasOwn(screens, flow.initialScreen)) {
    throw new Error(
      `Flow "${flow.id}" variant "${variantId}" does not implement its initial screen "${flow.initialScreen}"`,
    )
  }

  const variantState = variant?.initialState

  return {
    code: flow.code ?? null,
    components: { ...flow.components, ...variant?.components },
    createStore: (initialState) =>
      flow.createStore(
        variantState && initialState ? { ...variantState, ...initialState } : (initialState ?? variantState),
      ),
    descriptionKey: flow.descriptionKey ?? null,
    designFrames: { ...flow.designFrames, ...variant?.designFrames },
    flowId: flow.id,
    initialScreen: flow.initialScreen,
    screens,
    titleKey: flow.titleKey,
    variantCode: variant?.code ?? null,
    variantId,
  }
}

export const resolveFlow = <S extends string, C extends ComponentEnvironment, I extends object>(
  flow: FlowDefinition<S, C, I>,
  variantId: string | null,
): ResolvedFlow<S, C, I> => {
  let byVariant = cache.get(flow)
  if (!byVariant) {
    byVariant = new Map()
    cache.set(flow, byVariant)
  }

  const cached = byVariant.get(variantId)
  if (cached) return cached as ResolvedFlow<S, C, I>

  const resolved = createResolvedFlow(flow, variantId)
  byVariant.set(variantId, resolved)
  return resolved
}
