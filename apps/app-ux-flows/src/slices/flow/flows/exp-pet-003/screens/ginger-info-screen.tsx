import { useAtomValue } from 'jotai'
import { CardText, Diagram3, Paperclip, People } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { MedicationRow } from '../../../pods/ginger/components/medication-row'
import { toMedicationSummary } from '../../../pods/ginger/medication-fields'
import { medicationAtom, podAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { AddMedicationAction } from '../components/add-medication-action'
import { ExpPet003TopBar } from '../components/exp-pet-003-top-bar'
import {
  type ExpPet003Components,
  type ExpPet003Events,
  type ExpPet003ScreenId,
  medicalPresentationAtom,
} from '../model'

export const GingerInfoScreen = () => {
  const { t, i18n } = useTranslation()
  const { CategoryRow, Divider, PodScreen, RecordRow, SectionLabel } = useFlowComponents<ExpPet003Components>()
  const { goToScreen } = useFlowNavigation<ExpPet003ScreenId>()
  const { track } = useFlowAnalytics<ExpPet003Events>()
  const pod = useAtomValue(podAtom)
  const medication = useAtomValue(medicationAtom)
  const presentation = useAtomValue(medicalPresentationAtom)

  const openMedical = () => {
    track('medical_opened')
    goToScreen('medical')
  }

  const openMedication = () => {
    track('medication_opened', { entry_point: 'ginger_info' })
    goToScreen('medication')
  }

  const summary = toMedicationSummary(medication, t, i18n.language)
  const preview =
    presentation === 'row-with-preview'
      ? t('flows.expPet003.medication.preview', { frequency: summary.frequency, name: summary.name })
      : undefined

  return (
    <PodScreen topBar={<ExpPet003TopBar tab="info" />}>
      <div className="flex flex-col gap-3">
        <section className="flex flex-col gap-3">
          <SectionLabel>{t('flows.expPet003.info.forms')}</SectionLabel>
          <RecordRow
            icon={CardText}
            onClick={() => track('info_row_selected', { row: 'pet_form' })}
            title={t('pods.catalog.forms.pet')}
          />
        </section>
        {presentation === 'inline' && (
          <section className="flex flex-col gap-3">
            <SectionLabel>{t('flows.expPet003.info.medical')}</SectionLabel>
            <MedicationRow onOpen={openMedication} />
            <AddMedicationAction entryPoint="ginger_info" />
          </section>
        )}
        <Divider />
        {presentation !== 'inline' && (
          <CategoryRow
            // The pod holds a single medication record.
            count={1}
            icon={Paperclip}
            label={t('pods.ginger.categories.medical')}
            onClick={openMedical}
            preview={preview}
          />
        )}
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
