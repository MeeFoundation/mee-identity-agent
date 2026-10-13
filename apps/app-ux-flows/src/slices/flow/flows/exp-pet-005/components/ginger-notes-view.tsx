import { useAtomValue } from 'jotai'

import { NotesArea } from '../../../pods/notes/notes-area'
import { useFlowComponents } from '../../../runtime/flow-context'
import { doseSurfaceAtom, type ExpPet005Components } from '../model'
import { DoseToast } from './dose-toast'
import { ExpPet005TopBar } from './exp-pet-005-top-bar'
import { FlowDoseCard } from './flow-dose-card'

type ViewProps = {
  // Off while a confirmation sheet is shown over this view.
  showToast?: boolean
}

export const GingerNotesView = ({ showToast = false }: ViewProps) => {
  const { PodScreen } = useFlowComponents<ExpPet005Components>()
  const surface = useAtomValue(doseSurfaceAtom)

  return (
    <PodScreen topBar={<ExpPet005TopBar tab="notes" />}>
      {showToast && <DoseToast screen="ginger-notes" />}
      {surface === 'pod' && <FlowDoseCard origin="ginger-notes" />}
      <NotesArea />
    </PodScreen>
  )
}
