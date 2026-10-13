import { NotesArea } from '../../../pods/notes/notes-area'
import { useFlowComponents } from '../../../runtime/flow-context'
import { DemoTopBar } from '../components/demo-top-bar'
import type { ExpDemo001Components } from '../model'

export const GingerNotesScreen = () => {
  const { PodScreen } = useFlowComponents<ExpDemo001Components>()

  return (
    <PodScreen topBar={<DemoTopBar tab="notes" />}>
      <NotesArea />
    </PodScreen>
  )
}
