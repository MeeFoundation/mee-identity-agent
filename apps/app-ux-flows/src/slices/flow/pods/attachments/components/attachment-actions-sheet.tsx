import { Floppy, Pencil, Trash3 } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import type { PodComponents } from '@/shared/ui/pod-components'

import { useFlowComponents } from '../../../runtime/flow-context'
import { toAttachmentDetail } from '../format'
import type { Attachment } from '../model'

type AttachmentActionsSheetProps = {
  attachment: Attachment
  // The name of the member who added the file; omitted when the participant added it.
  addedByName?: string
  onSave: () => void
  onRename: () => void
  // Runs straight away; a flow that wants a confirmation shows it itself.
  onDelete: () => void
  onDismiss: () => void
}

export const AttachmentActionsSheet = ({
  attachment,
  addedByName,
  onSave,
  onRename,
  onDelete,
  onDismiss,
}: AttachmentActionsSheetProps) => {
  const { t, i18n } = useTranslation()
  const { BottomSheet, SheetActionList } = useFlowComponents<PodComponents>()
  const detail = toAttachmentDetail(attachment, new Date(), t, i18n.language)

  return (
    <BottomSheet
      description={
        addedByName === undefined
          ? t('pods.attachments.actionsSheet.description', { detail })
          : t('pods.attachments.actionsSheet.descriptionByMember', { detail, name: addedByName })
      }
      onDismiss={onDismiss}
      title={attachment.name}
    >
      <SheetActionList
        actions={[
          { icon: Floppy, label: t('pods.attachments.actionsSheet.save'), onClick: onSave },
          { icon: Pencil, label: t('pods.attachments.actionsSheet.rename'), onClick: onRename },
          { icon: Trash3, label: t('pods.attachments.actionsSheet.delete'), onClick: onDelete, tone: 'danger' },
        ]}
      />
    </BottomSheet>
  )
}
