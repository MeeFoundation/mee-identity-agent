import { useTranslation } from 'react-i18next'

import type { PodComponents } from '@/shared/ui/pod-components'

import { useFlowComponents } from '../../../runtime/flow-context'
import { toAttachmentDetail } from '../format'
import { type Attachment, attachmentKindIcons, toAttachmentKind } from '../model'

type AttachmentItemProps = {
  attachment: Attachment
  onMenu: () => void
  onOpen?: () => void
}

// An attachment shown as an AttachmentRow: the icon for its kind, and its size and date under the name.
export const AttachmentItem = ({ attachment, onMenu, onOpen }: AttachmentItemProps) => {
  const { t, i18n } = useTranslation()
  const { AttachmentRow } = useFlowComponents<PodComponents>()

  return (
    <AttachmentRow
      detail={toAttachmentDetail(attachment, new Date(), t, i18n.language)}
      icon={attachmentKindIcons[toAttachmentKind(attachment.name)]}
      name={attachment.name}
      onMenu={onMenu}
      onOpen={onOpen}
    />
  )
}
