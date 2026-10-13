import { useAtomValue } from 'jotai'
import type { ComponentProps, ReactNode } from 'react'
import { ChevronRight } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import { type GingerPodComponents, podAtom } from '../model'

type AppTab = Parameters<ComponentProps<GingerPodComponents['AppTabBar']>['onSelect']>[0]

type GingerHomeViewProps = {
  onOpenPod: () => void
  // Called for every app tab but Home, which is the current screen.
  onAppTabSelect: (tab: Exclude<AppTab, 'home'>) => void
  // A section shown above Pods, such as a flow's Today section.
  beforePods?: ReactNode
}

// The app's Home with Ginger as the participant's only pod.
export const GingerHomeView = ({ onOpenPod, onAppTabSelect, beforePods }: GingerHomeViewProps) => {
  const { t } = useTranslation()
  const { AppTabBar, PodScreen, SectionLabel } = useFlowComponents<GingerPodComponents>()
  const pod = useAtomValue(podAtom)

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
        <header className="rounded-3xl border-white border-b bg-linear-to-b from-brand-100 to-white pt-(--status-bar-h) drop-shadow-topbar">
          <div className="flex flex-col gap-4 px-5 pt-2.5 pb-5">
            <span
              aria-hidden
              className="flex size-11 items-center justify-center rounded-full border border-gray-200 bg-white font-medium text-gray-700"
            >
              {t('pods.ginger.home.userInitial')}
            </span>
            <h1 className="font-semibold text-gray-900 text-xl">{t('pods.ginger.home.welcome')}</h1>
          </div>
        </header>
      }
    >
      {beforePods}
      <section className="flex flex-col gap-3">
        <SectionLabel>{t('pods.ginger.home.pods')}</SectionLabel>
        <button
          className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-white py-2 pr-4 pl-2 text-left shadow-card outline-none transition-colors hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring"
          onClick={onOpenPod}
          type="button"
        >
          <img alt="" className="size-12 shrink-0 rounded-full object-cover" src={pod.avatarSrc} />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-medium text-base text-gray-900">{pod.name}</span>
            <span className="text-gray-600 text-sm">{pod.breadcrumb.join(' › ')}</span>
          </span>
          <ChevronRight aria-hidden className="shrink-0 text-gray-700" size={16} />
        </button>
      </section>
    </PodScreen>
  )
}
