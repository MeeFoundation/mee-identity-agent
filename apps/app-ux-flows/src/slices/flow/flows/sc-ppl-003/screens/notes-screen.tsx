import { ReadOnlyNotesArea } from '../../../pods/notes/tidy-notes-area'
import { contactFullName } from '../../../pods/people/contact-info'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { SharedPodTopBar } from '../components/shared-pod-top-bar'
import { type ScPpl003Components, type ScPpl003ScreenId, sofiaContact, sofiaNote } from '../model'

export const NotesScreen = () => {
  const { PodScreen } = useFlowComponents<ScPpl003Components>()
  const { goToScreen } = useFlowNavigation<ScPpl003ScreenId>()

  return (
    <PodScreen topBar={<SharedPodTopBar tab="notes" />}>
      <ReadOnlyNotesArea
        blocks={sofiaNote}
        contactLinkLabel={contactFullName(sofiaContact)}
        onOpenContactLink={() => goToScreen('contact-info')}
      />
    </PodScreen>
  )
}
