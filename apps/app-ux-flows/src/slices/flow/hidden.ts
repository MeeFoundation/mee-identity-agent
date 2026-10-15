import type { AnyFlow } from './runtime/define-flow'

const withoutHiddenEntries = <T extends { hidden?: true }>(entries: Readonly<Record<string, T>>) =>
  Object.fromEntries(Object.entries(entries).filter(([, entry]) => !entry.hidden))

const isEmpty = (entries: object) => Object.keys(entries).length === 0

// What a production build keeps of a flow: nothing when the flow, or every one of its variants or cases, is hidden.
// A flow with nothing hidden comes back as the same object, so lookups keep their identity.
export const withoutHidden = (flow: AnyFlow): AnyFlow | undefined => {
  if (flow.hidden) return undefined

  if (flow.kind === 'experiment') {
    if (!flow.variants) return flow
    const variants = withoutHiddenEntries(flow.variants)
    if (isEmpty(variants)) return undefined
    if (Object.keys(variants).length === Object.keys(flow.variants).length) return flow
    const { defaultVariant, ...rest } = flow
    return {
      ...rest,
      variants,
      ...(defaultVariant !== undefined && Object.hasOwn(variants, defaultVariant) && { defaultVariant }),
    }
  }

  if (!flow.cases) return flow
  const cases = withoutHiddenEntries(flow.cases)
  if (isEmpty(cases)) return undefined
  if (Object.keys(cases).length === Object.keys(flow.cases).length) return flow
  return { ...flow, cases }
}
