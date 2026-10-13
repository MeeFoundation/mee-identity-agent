export type FlowSearch = {
  variant?: string
  case?: string
}

export const validateFlowSearch = (search: Record<string, unknown>): FlowSearch => ({
  ...(typeof search.variant === 'string' && { variant: search.variant }),
  ...(typeof search.case === 'string' && { case: search.case }),
})
