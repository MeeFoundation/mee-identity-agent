import { FileEarmark, FileEarmarkImage } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import type { PodComponents } from '@/shared/ui/pod-components'

type AddAttachmentSheetProps = {
  onMediaFile: () => void
  onDocument: () => void
  onDismiss: () => void
}

// What a participant can add to the pod's Files; pods have no folders, so there is no folder option.
export const AddAttachmentSheet = ({ onMediaFile, onDocument, onDismiss }: AddAttachmentSheetProps) => {
  const { t } = useTranslation()
  const { BottomSheet, SheetActionList } = useFlowComponents<PodComponents>()

  return (
    <BottomSheet
      description={t('pods.attachments.addSheet.description')}
      onDismiss={onDismiss}
      title={t('pods.attachments.addSheet.title')}
    >
      <SheetActionList
        actions={[
          { icon: FileEarmarkImage, label: t('pods.attachments.addSheet.mediaFile'), onClick: onMediaFile },
          { icon: FileEarmark, label: t('pods.attachments.addSheet.document'), onClick: onDocument },
        ]}
      />
    </BottomSheet>
  )
}
