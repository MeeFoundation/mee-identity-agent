import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { FilesView } from '../components/files-view'
import {
  completesRename,
  filesAtom,
  goalAtom,
  nameProblem,
  renameFileAtom,
  type ScAtt001Components,
  type ScAtt001ScreenId,
  selectedFileAtom,
} from '../model'

type RenameSheetProps = {
  fileId: string
  initialName: string
}

const RenameSheet = ({ fileId, initialName }: RenameSheetProps) => {
  const { t } = useTranslation()
  const { BottomSheet, InlineFieldEditor, TextField } = useFlowComponents<ScAtt001Components>()
  const { complete, goToScreen } = useFlowNavigation<ScAtt001ScreenId>()
  const goal = useAtomValue(goalAtom)
  const files = useAtomValue(filesAtom)
  const renameFile = useSetAtom(renameFileAtom)
  const [name, setName] = useState(initialName)
  const problem = nameProblem(files, fileId, name)

  const save = () => {
    const result = renameFile(fileId, name)
    if (result.status === 'invalid') return
    goToScreen('files')
    if (goal === 'rename' && completesRename(result, name)) complete({ showCompletionView: false })
  }

  const cancel = () => goToScreen('files')

  return (
    <BottomSheet onDismiss={cancel} title={t('flows.scAtt001.rename.title')}>
      <InlineFieldEditor onCancel={cancel} onSave={save} saveDisabled={problem !== null}>
        <TextField
          error={problem === 'taken' ? t('flows.scAtt001.rename.taken') : undefined}
          label={t('flows.scAtt001.rename.field')}
          onChange={setName}
          value={name}
        />
      </InlineFieldEditor>
    </BottomSheet>
  )
}

export const RenameScreen = () => {
  const { goToScreen } = useFlowNavigation<ScAtt001ScreenId>()
  const file = useAtomValue(selectedFileAtom)
  const missing = file === undefined

  useEffect(() => {
    if (missing) goToScreen('files')
  }, [missing, goToScreen])

  if (!file) return <FilesView />

  return (
    <>
      <FilesView />
      <RenameSheet fileId={file.id} initialName={file.name} />
    </>
  )
}
