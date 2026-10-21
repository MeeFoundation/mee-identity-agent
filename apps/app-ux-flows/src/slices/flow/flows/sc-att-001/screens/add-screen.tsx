import { useAtomValue, useSetAtom } from 'jotai'

import { AddAttachmentSheet } from '../../../pods/attachments/components/add-attachment-sheet'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { FilesView } from '../components/files-view'
import { addFileAtom, completesAdd, goalAtom, type PickedKind, type ScAtt001ScreenId } from '../model'

export const AddScreen = () => {
  const { complete, goToScreen } = useFlowNavigation<ScAtt001ScreenId>()
  const goal = useAtomValue(goalAtom)
  const addFile = useSetAtom(addFileAtom)

  const pick = (kind: PickedKind) => {
    addFile(kind, new Date())
    goToScreen('files')
    if (goal === 'add' && completesAdd(kind)) complete({ showCompletionView: false })
  }

  return (
    <>
      <FilesView />
      <AddAttachmentSheet
        onDismiss={() => goToScreen('files')}
        onDocument={() => pick('document')}
        onMediaFile={() => pick('media')}
      />
    </>
  )
}
