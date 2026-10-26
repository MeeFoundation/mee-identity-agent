import { useAtomValue } from 'jotai'
import type { ComponentProps, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import { podCategoryIris } from '../../catalog/categories'
import { categoryIcon } from '../../category-icons'
import { type GingerPodComponents, podAtom } from '../model'
import type { PodSummary } from '@/shared/ui/pod-summary'

type AppTab = Parameters<ComponentProps<GingerPodComponents['AppTabBar']>['onSelect']>[0]

type GingerHomeViewProps = {
  onOpenPod: () => void
  // Called for every app tab but Home, which is the current screen.
  onAppTabSelect: (tab: Exclude<AppTab, 'home'>) => void
  // A section shown above Pods, such as a flow's Today section.
  beforePods?: ReactNode
  onSearchSelect?: () => void
}

// The app's Home with Ginger as the participant's only pod.
export const GingerHomeView = ({ onOpenPod, onAppTabSelect, beforePods, onSearchSelect }: GingerHomeViewProps) => {
  const { t } = useTranslation()
  const { AppTabBar, HomeTopBar, PodScreen, PodsSection } = useFlowComponents<GingerPodComponents>()
  const pod = useAtomValue(podAtom)
  const [category, subcategory] = pod.breadcrumb
  const summary: PodSummary = {
    avatarSrc: pod.avatarSrc,
    category: { icon: categoryIcon(podCategoryIris.pets), label: category ?? '' },
    hasUnread: false,
    id: 'ginger',
    name: pod.name,
    subcategory: subcategory === undefined ? undefined : { label: subcategory },
  }

  return (
    <PodScreen
      bottomBar={
        <AppTabBar
          active="home"
          onSelect={(tab) => {
            if (tab !== 'home') onAppTabSelect(tab)
          }}
        />
      }
      topBar={
        <HomeTopBar
          greeting={t('pods.ginger.home.welcome')}
          initial={t('pods.ginger.home.userInitial')}
          onSearchSelect={onSearchSelect}
        />
      }
    >
      {beforePods}
      <PodsSection onPodPress={onOpenPod} pods={[summary]} status="ready" />
    </PodScreen>
  )
}
