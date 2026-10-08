import { useFlowComponents } from '../../../runtime/flow-context'
import { GingerTopBar } from '../components/ginger-top-bar'
import { NotesArea } from '../components/notes-area'
import type { ExpPet002Components } from '../model'

export const GingerNotesScreen = () => {
  const { PodScreen } = useFlowComponents<ExpPet002Components>()

  return (
    <PodScreen topBar={<GingerTopBar tab="notes" />}>
      <NotesArea />
    </PodScreen>
  )
}
