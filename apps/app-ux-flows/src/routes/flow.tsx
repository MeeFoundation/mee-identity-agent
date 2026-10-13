import { createRoute, notFound, redirect } from '@tanstack/react-router'

import { findFlow } from '@/slices/flow/registry'

import { validateFlowSearch } from './flow-search'
import { rootRoute } from './root'

export const flowRoute = createRoute({
  beforeLoad: ({ params, search }) => {
    const flow = findFlow(params.flowId)
    if (!flow) throw notFound()

    throw redirect({
      params: { flowId: flow.id, screenId: flow.initialScreen },
      replace: true,
      search,
      to: '/flows/$flowId/$screenId',
    })
  },
  getParentRoute: () => rootRoute,
  path: 'flows/$flowId',
  validateSearch: validateFlowSearch,
})
