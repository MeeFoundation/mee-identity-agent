import { useAtomValue, useSetAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import { GingerCategoryRows } from '../../../pods/ginger/components/ginger-category-rows'
import { GingerFormsSection } from '../../../pods/ginger/components/ginger-forms-section'
import { addMedicationFormAtom, medicationFormAddedAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import type { ExpDemo001Components, ExpDemo001Events, ExpDemo001ScreenId } from '../model'
import { DemoTopBar } from './demo-top-bar'

type DemoInfoViewProps = {
  // `medication-added` shows the added form even before its effect has updated the run state.
  medicationFormAdded?: boolean
}

export const DemoInfoView = ({ medicationFormAdded: forcedAdded = false }: DemoInfoViewProps) => {
  const { t } = useTranslation()
  const { Divider, PodScreen } = useFlowComponents<ExpDemo001Components>()
  const { goToScreen } = useFlowNavigation<ExpDemo001ScreenId>()
  const { track } = useFlowAnalytics<ExpDemo001Events>()
  const medicationFormAdded = useAtomValue(medicationFormAddedAtom) || forcedAdded
  const addMedicationForm = useSetAtom(addMedicationFormAtom)

  const addMedication = () => {
    track('medication_form_added', { method: 'empty_state' })
    addMedicationForm()
    goToScreen('medication-added')
  }

  return (
    <PodScreen topBar={<DemoTopBar tab="info" />}>
      <div className="flex flex-col gap-3">
        <GingerFormsSection
          emptyAction={{ label: t('flows.expDemo001.forms.addMedication'), onAction: addMedication }}
          medicationFormAdded={medicationFormAdded}
        />
        <Divider />
        <GingerCategoryRows />
      </div>
    </PodScreen>
  )
}
