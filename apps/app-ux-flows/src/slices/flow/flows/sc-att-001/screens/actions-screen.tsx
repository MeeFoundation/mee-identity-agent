import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { AttachmentActionsSheet } from '../../../pods/attachments/components/attachment-actions-sheet'
import { useFlowNavigation } from '../../../runtime/flow-context'
import { FilesView } from '../components/files-view'
import {
  addedByName,
  completesDelete,
  deleteFileAtom,
  goalAtom,
  type ScAtt001ScreenId,
  selectedFileAtom,
  toastAtom,
} from '../model'

export const ActionsScreen = () => {
  const { complete, goToScreen } = useFlowNavigation<ScAtt001ScreenId>()
  const goal = useAtomValue(goalAtom)
  const file = useAtomValue(selectedFileAtom)
  const deleteFile = useSetAtom(deleteFileAtom)
  const setToast = useSetAtom(toastAtom)
  const missing = file === undefined

  useEffect(() => {
    if (missing) goToScreen('files')
  }, [missing, goToScreen])

  if (!file) return <FilesView />

  const save = () => {
    setToast(file.name)
    goToScreen('files')
  }

  const remove = () => {
    const deleted = deleteFile(file.id)
    goToScreen('files')
    if (goal === 'delete' && completesDelete(deleted)) complete({ showCompletionView: false })
  }

  return (
    <>
      <FilesView />
      <AttachmentActionsSheet
        addedByName={addedByName(file)}
        attachment={file}
        onDelete={remove}
        onDismiss={() => goToScreen('files')}
        onRename={() => goToScreen('rename')}
        onSave={save}
      />
    </>
  )
}
