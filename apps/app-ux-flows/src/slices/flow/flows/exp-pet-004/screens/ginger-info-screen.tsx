import { useAtomValue } from 'jotai'
import { CardText, Diagram3, Paperclip, People } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { podAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { ExpPet004TopBar } from '../components/exp-pet-004-top-bar'
import type { ExpPet004Components, ExpPet004Events, ExpPet004ScreenId } from '../model'

// EXP-PET-003-A's Info layout in every variant, so reaching the medication is the same everywhere.
export const GingerInfoScreen = () => {
  const { t } = useTranslation()
  const { CategoryRow, Divider, PodScreen, RecordRow, SectionLabel } = useFlowComponents<ExpPet004Components>()
  const { goToScreen } = useFlowNavigation<ExpPet004ScreenId>()
  const { track } = useFlowAnalytics<ExpPet004Events>()
  const pod = useAtomValue(podAtom)

  const openMedical = () => {
    track('medical_opened')
    goToScreen('medical')
  }

  return (
    <PodScreen topBar={<ExpPet004TopBar tab="info" />}>
      <div className="flex flex-col gap-3">
        <section className="flex flex-col gap-3">
          <SectionLabel>{t('flows.expPet004.info.forms')}</SectionLabel>
          <RecordRow
            icon={CardText}
            onClick={() => track('info_row_selected', { row: 'pet_form' })}
            title={t('pods.catalog.forms.pet')}
          />
        </section>
        <Divider />
        <CategoryRow
          // The pod holds a single medication record.
          count={1}
          icon={Paperclip}
          label={t('pods.ginger.categories.medical')}
          onClick={openMedical}
        />
        <CategoryRow
          count={0}
          icon={Paperclip}
          label={t('pods.ginger.categories.attachments')}
          onClick={() => track('info_row_selected', { row: 'attachments' })}
        />
        <CategoryRow
          count={0}
          icon={Diagram3}
          label={t('pods.ginger.categories.subpods')}
          onClick={() => track('info_row_selected', { row: 'subpods' })}
        />
        <CategoryRow
          count={pod.memberCount}
          icon={People}
          label={t('pods.ginger.categories.members')}
          onClick={() => track('info_row_selected', { row: 'members' })}
        />
      </div>
    </PodScreen>
  )
}
