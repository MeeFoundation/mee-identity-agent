import { NotesArea } from '../../../pods/ginger/components/notes-area'
import { useFlowComponents } from '../../../runtime/flow-context'
import { ExpPet004TopBar } from '../components/exp-pet-004-top-bar'
import type { ExpPet004Components } from '../model'

export const GingerNotesScreen = () => {
  const { PodScreen } = useFlowComponents<ExpPet004Components>()

  return (
    <PodScreen topBar={<ExpPet004TopBar tab="notes" />}>
      <NotesArea />
    </PodScreen>
  )
}
