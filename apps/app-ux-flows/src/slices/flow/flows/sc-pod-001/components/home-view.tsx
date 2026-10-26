import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import { listingAtom, type ScPod001Components } from '../model'
import { samplePods } from '../sample-pods'

const noop = () => {}

// Home with the pods section in the run's state; every control but Retry is inert.
export const HomeView = () => {
  const { t } = useTranslation()
  const { AppTabBar, HomeTopBar, PodScreen, PodsSection } = useFlowComponents<ScPod001Components>()
  const listing = useAtomValue(listingAtom)
  const setListing = useSetAtom(listingAtom)

  return (
    <PodScreen
      bottomBar={<AppTabBar active="home" onSelect={noop} />}
      topBar={<HomeTopBar greeting={t('flows.scPod001.welcome')} initial={t('flows.scPod001.userInitial')} />}
    >
      <PodsSection
        onAddPod={noop}
        onDismissEmpty={noop}
        onPodPress={noop}
        onRetry={() => setListing('loading')}
        onSeeAll={noop}
        pods={listing === 'pods' ? samplePods : []}
        status={listing === 'loading' ? 'loading' : listing === 'error' ? 'error' : 'ready'}
      />
    </PodScreen>
  )
}
