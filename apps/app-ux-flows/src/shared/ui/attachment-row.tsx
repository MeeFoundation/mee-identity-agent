import { type Icon, ThreeDotsVertical } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/cn'

type AttachmentRowProps = {
  // Shows the kind of file, such as an image or a spreadsheet.
  icon: Icon
  name: string
  // A quieter line under the name, e.g. its size and when it was added.
  detail: string
  onMenu: () => void
  // Without it the row is not a control; only its "more actions" button is.
  onOpen?: () => void
}

const contentClassName = 'flex min-w-0 flex-1 items-center gap-3 rounded-xl p-3 text-left'

// One file in an AttachmentList.
export const AttachmentRow = ({ icon: FileIcon, name, detail, onMenu, onOpen }: AttachmentRowProps) => {
  const { t } = useTranslation()

  const content = (
    <>
      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        <FileIcon aria-hidden className="text-brand-500" size={24} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium text-base text-gray-900">{name}</span>
        <span className="truncate text-gray-600 text-sm">{detail}</span>
      </span>
    </>
  )

  return (
    <div className="flex items-center gap-1 pr-2">
      {onOpen ? (
        <button
          aria-label={t('ui.attachmentRow.open', { detail, name })}
          className={cn(
            contentClassName,
            'cursor-pointer outline-none transition-colors hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring',
          )}
          onClick={onOpen}
          type="button"
        >
          {content}
        </button>
      ) : (
        <div className={contentClassName}>{content}</div>
      )}
      <button
        aria-label={t('ui.attachmentRow.menu', { name })}
        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl outline-none transition-colors hover:bg-gray-950/5 focus-visible:ring-3 focus-visible:ring-ring"
        onClick={onMenu}
        type="button"
      >
        <ThreeDotsVertical aria-hidden className="text-gray-700" size={20} />
      </button>
    </div>
  )
}
