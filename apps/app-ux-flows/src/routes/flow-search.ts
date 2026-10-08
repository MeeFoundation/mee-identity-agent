export type FlowSearch = {
  variant?: string
}

export const validateFlowSearch = (search: Record<string, unknown>): FlowSearch =>
  typeof search.variant === 'string' ? { variant: search.variant } : {}
