import {
  FileEarmarkImage,
  FileEarmarkPlay,
  FileEarmarkSpreadsheet,
  FileEarmarkText,
  type Icon,
} from 'react-bootstrap-icons'

// A file attached to a pod. Pods have no folders, so every attachment sits directly in the pod's Files.
export type Attachment = {
  id: string
  name: string
  sizeBytes: number
  // ISO calendar date (YYYY-MM-DD).
  addedAt: string
  // The id of the pod member who added the file.
  addedBy: string
}

export type AttachmentKind = 'video' | 'image' | 'spreadsheet' | 'document'

const extensionKinds = new Map<string, AttachmentKind>([
  ['avi', 'video'],
  ['m4v', 'video'],
  ['mov', 'video'],
  ['mp4', 'video'],
  ['webm', 'video'],
  ['gif', 'image'],
  ['heic', 'image'],
  ['jpeg', 'image'],
  ['jpg', 'image'],
  ['png', 'image'],
  ['webp', 'image'],
  ['csv', 'spreadsheet'],
  ['numbers', 'spreadsheet'],
  ['ods', 'spreadsheet'],
  ['xls', 'spreadsheet'],
  ['xlsx', 'spreadsheet'],
])

// Derived from the name rather than stored, so a renamed file never keeps a stale kind.
export const toAttachmentKind = (name: string): AttachmentKind => {
  const dot = name.lastIndexOf('.')
  if (dot === -1) return 'document'
  return extensionKinds.get(name.slice(dot + 1).toLowerCase()) ?? 'document'
}

export const attachmentKindIcons: Record<AttachmentKind, Icon> = {
  document: FileEarmarkText,
  image: FileEarmarkImage,
  spreadsheet: FileEarmarkSpreadsheet,
  video: FileEarmarkPlay,
}
