import { NotesArea } from '../../../pods/ginger/components/notes-area'
import { useFlowComponents } from '../../../runtime/flow-context'
import { ExpPet002TopBar } from '../components/exp-pet-002-top-bar'
import type { ExpPet002Components } from '../model'

export const GingerNotesScreen = () => {
  const { PodScreen } = useFlowComponents<ExpPet002Components>()

  return (
    <PodScreen topBar={<ExpPet002TopBar tab="notes" />}>
      <NotesArea />
    </PodScreen>
  )
}
