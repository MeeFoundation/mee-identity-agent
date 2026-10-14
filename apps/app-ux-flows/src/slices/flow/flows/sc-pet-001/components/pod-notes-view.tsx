import type { PodInstance } from '../../../pods/catalog/create-pod'
import { NotesArea } from '../../../pods/notes/notes-area'
import { useFlowComponents } from '../../../runtime/flow-context'
import type { ScPet001Components } from '../model'
import { PodHeader } from './pod-header'

type PodNotesViewProps = {
  pod: PodInstance
}

// The pod's Notes tab. The suggestion timer and completion belong to the screen, so a sheet over this view starts neither.
export const PodNotesView = ({ pod }: PodNotesViewProps) => {
  const { PodScreen } = useFlowComponents<ScPet001Components>()

  return (
    <PodScreen topBar={<PodHeader pod={pod} tab="notes" />}>
      <NotesArea />
    </PodScreen>
  )
}
