import { useAtom } from 'jotai'
import { Fragment } from 'react'
import {
  BlockquoteLeft,
  CodeSlash,
  CodeSquare,
  ImageFill,
  Link45deg,
  ListOl,
  ListUl,
  TextIndentLeft,
  TextIndentRight,
  TextLeft,
  TextParagraph,
  TextRight,
  TypeBold,
  TypeItalic,
  TypeStrikethrough,
  TypeUnderline,
} from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { noteTextAtom } from '../model'

const toolbarGroups = [
  [
    { icon: Link45deg, labelKey: 'link' },
    { icon: ImageFill, labelKey: 'image' },
  ],
  [
    { icon: TypeBold, labelKey: 'bold' },
    { icon: TypeItalic, labelKey: 'italic' },
    { icon: TypeUnderline, labelKey: 'underline' },
    { icon: TypeStrikethrough, labelKey: 'strikethrough' },
  ],
  [
    { icon: TextLeft, labelKey: 'alignLeft' },
    { icon: TextParagraph, labelKey: 'paragraph' },
    { icon: TextRight, labelKey: 'alignRight' },
  ],
  [
    { icon: TextIndentLeft, labelKey: 'indent' },
    { icon: TextIndentRight, labelKey: 'outdent' },
  ],
  [
    { icon: ListOl, labelKey: 'orderedList' },
    { icon: ListUl, labelKey: 'unorderedList' },
  ],
  [{ icon: BlockquoteLeft, labelKey: 'blockquote' }],
  [
    { icon: CodeSlash, labelKey: 'inlineCode' },
    { icon: CodeSquare, labelKey: 'codeBlock' },
  ],
] as const

export const NotesArea = () => {
  const { t } = useTranslation()
  const [note, setNote] = useAtom(noteTextAtom)

  return (
    <div className="-m-1 flex flex-1 flex-col gap-4">
      <textarea
        aria-label={t('flows.expPet002.tabs.notes')}
        className="min-h-0 flex-1 resize-none bg-transparent text-base text-gray-800 caret-brand-700 outline-none placeholder:text-gray-500"
        onChange={(event) => setNote(event.target.value)}
        placeholder={t('flows.expPet002.notes.placeholder')}
        value={note}
      />
      <div className="-mx-4 overflow-x-auto px-4 pb-1">
        <div
          aria-label={t('flows.expPet002.notes.toolbar.label')}
          className="flex w-fit items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5"
          role="toolbar"
        >
          {toolbarGroups.map((group, groupIndex) => (
            <Fragment key={group[0].labelKey}>
              {groupIndex > 0 && (
                <span aria-hidden className="px-1">
                  <span className="block h-4 w-px bg-gray-300" />
                </span>
              )}
              {group.map((button) => (
                <button
                  aria-label={t(`flows.expPet002.notes.toolbar.${button.labelKey}`)}
                  className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl outline-none transition-colors hover:bg-gray-100 focus-visible:ring-3 focus-visible:ring-ring"
                  key={button.labelKey}
                  type="button"
                >
                  <button.icon aria-hidden className="text-gray-700" size={24} />
                </button>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
