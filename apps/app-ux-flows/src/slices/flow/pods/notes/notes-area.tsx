import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import { noteTextAtom } from './model'
import { NotesToolbar } from './notes-toolbar'

export const NotesArea = () => {
  const { t } = useTranslation()
  const [note, setNote] = useAtom(noteTextAtom)

  return (
    <div className="-m-1 flex flex-1 flex-col gap-4">
      <textarea
        aria-label={t('pods.ginger.tabs.notes')}
        className="min-h-0 flex-1 resize-none bg-transparent text-base text-gray-800 caret-brand-700 outline-none placeholder:text-gray-500"
        onChange={(event) => setNote(event.target.value)}
        placeholder={t('pods.ginger.notes.placeholder')}
        value={note}
      />
      <NotesToolbar />
    </div>
  )
}
