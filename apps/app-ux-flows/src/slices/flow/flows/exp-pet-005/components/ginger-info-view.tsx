import { useAtomValue } from 'jotai'
import { CardText, Diagram3, Paperclip, People } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { podAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { doseSurfaceAtom, type ExpPet005Components, type ExpPet005Events, type ExpPet005ScreenId } from '../model'
import { DoseToast } from './dose-toast'
import { ExpPet005TopBar } from './exp-pet-005-top-bar'
import { FlowDoseCard } from './flow-dose-card'

type ViewProps = {
  // Off while a confirmation sheet is shown over this view.
  showToast?: boolean
}

// EXP-PET-004's Info layout in every variant, so reaching Medical is the same everywhere.
export const GingerInfoView = ({ showToast = false }: ViewProps) => {
  const { t } = useTranslation()
  const { CategoryRow, Divider, PodScreen, RecordRow, SectionLabel } = useFlowComponents<ExpPet005Components>()
  const { goToScreen } = useFlowNavigation<ExpPet005ScreenId>()
  const { track } = useFlowAnalytics<ExpPet005Events>()
  const pod = useAtomValue(podAtom)
  const surface = useAtomValue(doseSurfaceAtom)

  const openMedical = () => {
    track('medical_opened')
    goToScreen('medical')
  }

  return (
    <PodScreen topBar={<ExpPet005TopBar tab="info" />}>
      {showToast && <DoseToast screen="ginger-info" />}
      {surface === 'pod' && <FlowDoseCard origin="ginger-info" />}
      <div className="flex flex-col gap-3">
        <section className="flex flex-col gap-3">
          <SectionLabel>{t('flows.expPet005.info.forms')}</SectionLabel>
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
