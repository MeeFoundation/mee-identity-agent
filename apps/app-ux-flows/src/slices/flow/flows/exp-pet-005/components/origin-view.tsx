import type { DoseOrigin } from '../model'
import { GingerInfoView } from './ginger-info-view'
import { GingerNotesView } from './ginger-notes-view'
import { HomeView } from './home-view'
import { MedicalView } from './medical-view'
import { MedicationDetailsView } from './medication-details-view'

const views = {
  'ginger-info': GingerInfoView,
  'ginger-notes': GingerNotesView,
  home: HomeView,
  medical: MedicalView,
  medication: MedicationDetailsView,
} satisfies Record<DoseOrigin, unknown>

type OriginViewProps = {
  origin: DoseOrigin
}

// The screen the confirmation sheet is shown over, without its toast.
export const OriginView = ({ origin }: OriginViewProps) => {
  const View = views[origin]
  return <View />
}
