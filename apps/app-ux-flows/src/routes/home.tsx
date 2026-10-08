import { createRoute, useNavigate } from '@tanstack/react-router'

import { listFlows } from '@/slices/flow/registry'
import { HomePage } from '@/slices/home/home-page'

import { rootRoute } from './root'

const HomeRoute = () => {
  const { flows } = homeRoute.useLoaderData()
  const navigate = useNavigate()

  return <HomePage flows={flows} onStartFlow={(flowId) => navigate({ params: { flowId }, to: '/flows/$flowId' })} />
}

export const homeRoute = createRoute({
  component: HomeRoute,
  getParentRoute: () => rootRoute,
  loader: () => ({ flows: listFlows() }),
  path: '/',
})
