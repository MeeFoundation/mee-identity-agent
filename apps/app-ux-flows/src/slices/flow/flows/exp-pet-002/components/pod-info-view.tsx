import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import { GingerCategoryRows } from '../../../pods/ginger/components/ginger-category-rows'
import { GingerFormsSection } from '../../../pods/ginger/components/ginger-forms-section'
import { addMedicationFormAtom, medicationFormAddedAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  type ExpPet002Components,
  type ExpPet002Events,
  type ExpPet002ScreenId,
  sheetOriginAtom,
  showAiSuggestionAtom,
} from '../model'
import { ExpPet002TopBar } from './exp-pet-002-top-bar'

type PodInfoViewProps = {
  // `medication-added` shows the added form even before its effect has updated the run state.
  medicationFormAdded?: boolean
}

export const PodInfoView = ({ medicationFormAdded: forcedAdded = false }: PodInfoViewProps) => {
  const { t } = useTranslation()
  const { AiSuggestion, Divider, PodScreen } = useFlowComponents<ExpPet002Components>()
  const { goToScreen } = useFlowNavigation<ExpPet002ScreenId>()
  const { track } = useFlowAnalytics<ExpPet002Events>()
  const medicationFormAdded = useAtomValue(medicationFormAddedAtom) || forcedAdded
  const showAiSuggestion = useAtomValue(showAiSuggestionAtom)
  const addMedicationForm = useSetAtom(addMedicationFormAtom)
  const setSheetOrigin = useSetAtom(sheetOriginAtom)

  const openMedical = () => {
    track('medical_opened')
    goToScreen('medical')
  }

  const openAddForm = () => {
    track('add_form_clicked', { entry_point: 'forms_section' })
    setSheetOrigin('ginger-info')
    goToScreen('add-form')
  }

  const acceptSuggestion = () => {
    track('medication_form_added', { method: 'ai_suggestion' })
    addMedicationForm()
    goToScreen('medication-added')
  }

  return (
    <PodScreen topBar={<ExpPet002TopBar tab="info" />}>
      <div className="flex flex-col gap-3">
        {showAiSuggestion && !medicationFormAdded && (
          <div className="pt-2">
            <AiSuggestion
              caption={t('flows.expPet002.aiSuggestion.caption')}
              label={t('flows.expPet002.aiSuggestion.addMedication')}
              onClick={acceptSuggestion}
            />
          </div>
        )}
        <GingerFormsSection
          emptyAction={{ label: t('flows.expPet002.forms.addForm'), onAction: openAddForm }}
          medicationFormAdded={medicationFormAdded}
        />
        <Divider />
        <GingerCategoryRows onOpenMedical={openMedical} />
      </div>
    </PodScreen>
  )
}
