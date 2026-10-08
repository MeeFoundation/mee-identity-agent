import { createRoute, useNavigate, useRouter } from '@tanstack/react-router'

import { listFlows } from '@/slices/flow/registry'
import { browserAssignmentStore } from '@/slices/flow/variants/assignment-store'
import { listVariantChoices } from '@/slices/flow/variants/select-variant'
import { HomePage } from '@/slices/home/home-page'

import { rootRoute } from './root'

const HomeRoute = () => {
  const { flows } = homeRoute.useLoaderData()
  const navigate = useNavigate()
  const router = useRouter()

  const startNewSession = () => {
    browserAssignmentStore.clear()
    void router.invalidate()
  }

  return (
    <HomePage
      flows={flows}
      onStartFlow={(flowId, variantId) =>
        navigate({ params: { flowId }, search: variantId ? { variant: variantId } : {}, to: '/flows/$flowId' })
      }
      onStartNewSession={startNewSession}
    />
  )
}

export const homeRoute = createRoute({
  component: HomeRoute,
  getParentRoute: () => rootRoute,
  loader: () => ({
    flows: listFlows().map((flow) => ({
      assignedVariantId: import.meta.env.DEV ? browserAssignmentStore.read(flow.id) : null,
      id: flow.id,
      titleKey: flow.titleKey,
      variantChoices: listVariantChoices(flow),
    })),
  }),
  path: '/',
})
