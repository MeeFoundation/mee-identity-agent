import { NotesArea } from '../../../pods/notes/notes-area'
import { useFlowComponents } from '../../../runtime/flow-context'
import { ExpPet003TopBar } from '../components/exp-pet-003-top-bar'
import type { ExpPet003Components } from '../model'

export const GingerNotesScreen = () => {
  const { PodScreen } = useFlowComponents<ExpPet003Components>()

  return (
    <PodScreen topBar={<ExpPet003TopBar tab="notes" />}>
      <NotesArea />
    </PodScreen>
  )
}
