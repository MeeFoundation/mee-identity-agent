import { useAtomValue, useSetAtom } from 'jotai'
import { CardText } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { GingerCategoryRows } from '../../../pods/ginger/components/ginger-category-rows'
import { GingerTopBar } from '../../../pods/ginger/components/ginger-top-bar'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { memberCountAtom, type ScPet006Components, type ScPet006ScreenId, sentToastAtom } from '../model'

const noop = () => {}

// Ginger's Info tab: the way to Medical and to Members. Everything else on it does nothing.
export const InfoScreen = () => {
  const { t } = useTranslation()
  const { Divider, PodScreen, RecordRow, SectionLabel } = useFlowComponents<ScPet006Components>()
  const { goToScreen } = useFlowNavigation<ScPet006ScreenId>()
  const count = useAtomValue(memberCountAtom)
  const setSentTo = useSetAtom(sentToastAtom)

  const openMembers = () => {
    setSentTo(null)
    goToScreen('members')
  }

  return (
    <PodScreen topBar={<GingerTopBar onTabSelect={noop} tab="info" />}>
      <div className="flex flex-col gap-3">
        <section className="flex flex-col gap-3">
          <SectionLabel>{t('pods.ginger.forms.title')}</SectionLabel>
          <RecordRow icon={CardText} onClick={noop} title={t('pods.catalog.forms.pet')} />
        </section>
        <Divider />
        <GingerCategoryRows
          memberCount={count}
          onOpenMedical={() => goToScreen('medical')}
          onOpenMembers={openMembers}
        />
      </div>
    </PodScreen>
  )
}
