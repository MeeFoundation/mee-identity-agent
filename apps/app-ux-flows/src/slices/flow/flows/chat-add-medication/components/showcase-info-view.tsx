import { useAtomValue } from 'jotai'

import { GingerCategoryRows } from '../../../pods/ginger/components/ginger-category-rows'
import { GingerFormsSection } from '../../../pods/ginger/components/ginger-forms-section'
import { medicationFormAddedAtom } from '../../../pods/ginger/model'
import { useFlowComponents } from '../../../runtime/flow-context'
import type { ChatAddMedicationComponents } from '../model'
import { ShowcaseTopBar } from './showcase-top-bar'

type ShowcaseInfoViewProps = {
  // `medication-added` shows the added form even before its effect has updated the run state.
  medicationFormAdded?: boolean
}

export const ShowcaseInfoView = ({ medicationFormAdded: forcedAdded = false }: ShowcaseInfoViewProps) => {
  const { Divider, PodScreen } = useFlowComponents<ChatAddMedicationComponents>()
  const medicationFormAdded = useAtomValue(medicationFormAddedAtom) || forcedAdded

  return (
    <PodScreen topBar={<ShowcaseTopBar tab="info" />}>
      <div className="flex flex-col gap-3">
        <GingerFormsSection medicationFormAdded={medicationFormAdded} />
        <Divider />
        <GingerCategoryRows />
      </div>
    </PodScreen>
  )
}
