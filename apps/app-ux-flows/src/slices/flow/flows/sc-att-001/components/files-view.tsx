import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Plus } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { AttachmentItem } from '../../../pods/attachments/components/attachment-item'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { filesAtom, type ScAtt001Components, type ScAtt001ScreenId, selectedIdAtom, toastAtom } from '../model'

const noop = () => {}

type FilesViewProps = {
  // Off while a sheet is shown over the list.
  showToast?: boolean
}

const SavedToast = () => {
  const { t } = useTranslation()
  const { Toast } = useFlowComponents<ScAtt001Components>()
  const [fileName, setFileName] = useAtom(toastAtom)

  if (fileName === null) return null

  return (
    <Toast
      description={fileName}
      onClose={() => setFileName(null)}
      title={t('flows.scAtt001.toast.saved')}
      variant="success"
    />
  )
}

// The Attachments screen of Sofia's pod. The sheets are separate screens drawn over this same view.
export const FilesView = ({ showToast = false }: FilesViewProps) => {
  const { t } = useTranslation()
  const { AttachmentList, EmptyStateCard, FloatingActionButton, PodScreen, PodTopBar } =
    useFlowComponents<ScAtt001Components>()
  const { goToScreen } = useFlowNavigation<ScAtt001ScreenId>()
  const files = useAtomValue(filesAtom)
  const setSelectedId = useSetAtom(selectedIdAtom)
  const setToast = useSetAtom(toastAtom)

  // The toast belongs to the moment after a sheet; opening another sheet dismisses it.
  const open = (screen: Exclude<ScAtt001ScreenId, 'files'>) => {
    setToast(null)
    goToScreen(screen)
  }

  return (
    <PodScreen
      topBar={
        <PodTopBar
          avatar={{ letter: t('flows.scAtt001.pod.avatar') }}
          onBack={noop}
          onMenu={noop}
          subtitle={t('flows.scAtt001.pod.subtitle')}
          title={t('flows.scAtt001.pod.title')}
        />
      }
    >
      {showToast && <SavedToast />}
      {files.length === 0 ? (
        <EmptyStateCard message={t('flows.scAtt001.empty.message')} title={t('flows.scAtt001.empty.title')} />
      ) : (
        <AttachmentList>
          {files.map((file) => (
            <AttachmentItem
              attachment={file}
              key={file.id}
              onMenu={() => {
                setSelectedId(file.id)
                open('actions')
              }}
            />
          ))}
        </AttachmentList>
      )}
      <FloatingActionButton icon={Plus} label={t('flows.scAtt001.add')} onClick={() => open('add')} />
    </PodScreen>
  )
}
