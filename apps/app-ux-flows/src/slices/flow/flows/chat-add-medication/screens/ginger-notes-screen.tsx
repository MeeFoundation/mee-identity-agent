import { NotesArea } from '../../../pods/ginger/components/notes-area'
import { useFlowComponents } from '../../../runtime/flow-context'
import { ShowcaseTopBar } from '../components/showcase-top-bar'
import type { ChatAddMedicationComponents } from '../model'

export const GingerNotesScreen = () => {
  const { PodScreen } = useFlowComponents<ChatAddMedicationComponents>()

  return (
    <PodScreen topBar={<ShowcaseTopBar tab="notes" />}>
      <NotesArea />
    </PodScreen>
  )
}
