import { useAtomValue } from 'jotai'
import { People } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { notesScreenAtom, type ScPpl001Components, type ScPpl001ScreenId } from '../model'

const noop = () => {}

type PodTab = 'notes' | 'chat' | 'info'

export const SofiaTopBar = ({ tab }: { tab: Exclude<PodTab, 'chat'> }) => {
  const { t } = useTranslation()
  const { PodTopBar, SegmentedTabs } = useFlowComponents<ScPpl001Components>()
  const { goToScreen } = useFlowNavigation<ScPpl001ScreenId>()
  const notesScreen = useAtomValue(notesScreenAtom)

  const selectTab = (next: PodTab) => {
    if (next === tab) return
    if (next === 'notes') goToScreen(notesScreen)
    if (next === 'info') goToScreen('contact-info')
  }

  return (
    <PodTopBar
      avatar={{ letter: t('flows.scPpl001.pod.avatar') }}
      breadcrumb={[t('flows.scPpl001.pod.breadcrumb.people'), t('flows.scPpl001.pod.breadcrumb.immediateFamily')]}
      breadcrumbIcon={People}
      onBack={noop}
      onMenu={noop}
      tabs={
        <SegmentedTabs<PodTab>
          items={[
            { label: t('pods.ginger.tabs.notes'), value: 'notes' },
            { label: t('pods.ginger.tabs.chat'), value: 'chat' },
            { label: t('pods.ginger.tabs.info'), value: 'info' },
          ]}
          onSelect={selectTab}
          value={tab}
        />
      }
      title={t('flows.scPpl001.pod.title')}
    />
  )
}
