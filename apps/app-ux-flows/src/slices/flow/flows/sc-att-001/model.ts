import { atom } from 'jotai'

import type { Attachment } from '../../pods/attachments/model'
import { sofiaAttachments } from '../../pods/attachments/sofia-fixture'
import { andrew, geo } from '../../pods/people/sharing'
import type { DefaultComponents } from '@/shared/ui/default-components'
import type { PodComponents } from '@/shared/ui/pod-components'

export type ScAtt001ScreenId = 'files' | 'add' | 'actions' | 'rename'

export type ScAtt001Components = DefaultComponents & PodComponents

// What completes the run: adding a photo (A), renaming the About Sophia file to a PDF (B) or deleting the tracker (C).
export type ScAtt001Goal = 'add' | 'rename' | 'delete'

export type ScAtt001InitialState = {
  goal?: ScAtt001Goal
}

export type PickedKind = 'media' | 'document'

const PARTICIPANT_ID = 'you'

const RENAME_GOAL_FILE_ID = 'about-sophia'
const DELETE_GOAL_FILE_ID = 'activities-tracker'

// There is no real picker: each choice adds one of these.
const pickedFiles: Record<PickedKind, { name: string; sizeBytes: number }> = {
  document: { name: 'Invoice-june.pdf', sizeBytes: 320_000 },
  media: { name: 'photo-jul-15.jpg', sizeBytes: 1_500_000 },
}

const memberNames = new Map([
  [geo.id, geo.name],
  [andrew.id, andrew.name],
])

// Undefined when the participant added the file, as the actions sheet expects.
export const addedByName = (attachment: Attachment) =>
  attachment.addedBy === PARTICIPANT_ID ? undefined : memberNames.get(attachment.addedBy)

const toIsoDate = (date: Date) =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((part) => String(part).padStart(2, '0')).join('-')

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

// "photo-jul-15.jpg" taken: "photo-jul-15 2.jpg", then "photo-jul-15 3.jpg".
export const uniqueName = (files: readonly Attachment[], name: string) => {
  const taken = (candidate: string) => files.some((file) => sameName(file.name, candidate))
  if (!taken(name)) return name
  const dot = name.lastIndexOf('.')
  const stem = dot > 0 ? name.slice(0, dot) : name
  const extension = dot > 0 ? name.slice(dot) : ''
  for (let number = 2; ; number += 1) {
    const candidate = `${stem} ${number}${extension}`
    if (!taken(candidate)) return candidate
  }
}

export type NameProblem = 'empty' | 'taken'

// What stops a file from being renamed to `name`; its own current name is not a clash.
export const nameProblem = (files: readonly Attachment[], id: string, name: string): NameProblem | null => {
  if (name.trim() === '') return 'empty'
  return files.some((file) => file.id !== id && sameName(file.name, name)) ? 'taken' : null
}

export type RenameResult =
  | { status: 'renamed'; id: string }
  | { status: 'unchanged' }
  | { status: 'invalid'; problem: NameProblem }

export const filesAtom = atom<readonly Attachment[]>([])

export const goalAtom = atom<ScAtt001Goal>('add')

export const selectedIdAtom = atom<string | null>(null)

// The file a "saved to your device" toast is about.
export const toastAtom = atom<string | null>(null)

const addedCountAtom = atom(0)

export const selectedFileAtom = atom((get) => {
  const id = get(selectedIdAtom)
  return get(filesAtom).find((file) => file.id === id)
})

export const addFileAtom = atom(null, (get, set, kind: PickedKind, today: Date) => {
  const files = get(filesAtom)
  const count = get(addedCountAtom)
  const picked = pickedFiles[kind]
  const added: Attachment = {
    addedAt: toIsoDate(today),
    addedBy: PARTICIPANT_ID,
    id: `added-${count + 1}`,
    name: uniqueName(files, picked.name),
    sizeBytes: picked.sizeBytes,
  }
  set(addedCountAtom, count + 1)
  set(filesAtom, [added, ...files])
  return added
})

export const renameFileAtom = atom(null, (get, set, id: string, name: string): RenameResult => {
  const files = get(filesAtom)
  const problem = nameProblem(files, id, name)
  if (problem) return { problem, status: 'invalid' }
  const trimmed = name.trim()
  if (files.find((file) => file.id === id)?.name === trimmed) return { status: 'unchanged' }
  set(
    filesAtom,
    files.map((file) => (file.id === id ? { ...file, name: trimmed } : file)),
  )
  return { id, status: 'renamed' }
})

export const deleteFileAtom = atom(null, (get, set, id: string) => {
  const files = get(filesAtom)
  const deleted = files.find((file) => file.id === id)
  if (!deleted) return undefined
  set(
    filesAtom,
    files.filter((file) => file.id !== id),
  )
  return deleted
})

export const startingFiles = (): readonly Attachment[] => sofiaAttachments

export const completesAdd = (kind: PickedKind) => kind === 'media'

export const completesRename = (result: RenameResult, newName: string) =>
  result.status === 'renamed' && result.id === RENAME_GOAL_FILE_ID && newName.trim().toLowerCase().endsWith('.pdf')

export const completesDelete = (deleted: Attachment | undefined) => deleted?.id === DELETE_GOAL_FILE_ID
