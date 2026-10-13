import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useLayoutEffect, useState } from 'react'
import { PersonVcard } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { type ContactInfoField, toContactInfoFieldRows } from '../../../pods/people/contact-info'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { ContactFieldEditor } from '../components/contact-field-editor'
import { NotesView } from '../components/notes-view'
import {
  confirmTidyAtom,
  contactLinkLabelAtom,
  noteHasContactLinkAtom,
  type ScPpl001Components,
  type ScPpl001ScreenId,
  suggestionAtom,
  tidyOriginAtom,
  tidyPreviewAtom,
} from '../model'

export const TidyConfirmScreen = () => {
  const { t, i18n } = useTranslation()
  const { BottomSheet, Button, FieldRow, FormCard } = useFlowComponents<ScPpl001Components>()
  const { back, complete, goToScreen } = useFlowNavigation<ScPpl001ScreenId>()
  const store = useStore()
  const origin = useAtomValue(tidyOriginAtom)
  const hasLink = useAtomValue(noteHasContactLinkAtom)
  const preview = useAtomValue(tidyPreviewAtom)
  const confirmTidy = useSetAtom(confirmTidyAtom)
  const contactName = useAtomValue(contactLinkLabelAtom)
  const [editing, setEditing] = useState<ContactInfoField | null>(null)

  const rows = toContactInfoFieldRows(preview.record, t, i18n.language)

  // Only on arrival: once confirmed, the suggestion is gone while this screen is still on its way out.
  useLayoutEffect(() => {
    if (store.get(suggestionAtom).length === 0) goToScreen('notes')
  }, [store, goToScreen])

  const tidy = () => {
    confirmTidy()
    goToScreen('notes-tidied')
    complete({ showCompletionView: false })
  }

  return (
    <>
      <NotesView screenId={origin} />
      <BottomSheet
        description={hasLink ? t('flows.scPpl001.tidy.descriptionUpdate', { name: contactName }) : undefined}
        onDismiss={back}
        title={
          hasLink ? t('flows.scPpl001.tidy.titleUpdate', { name: contactName }) : t('flows.scPpl001.tidy.titleCreate')
        }
      >
        <div className="flex flex-col gap-6">
          <FormCard icon={PersonVcard} title={t('pods.people.contactInfo.title')}>
            {rows.map((row) => (
              <FieldRow
                badge={preview.newFields.has(row.id) ? t('flows.scPpl001.tidy.new') : undefined}
                editor={
                  editing === row.id && (
                    <ContactFieldEditor
                      field={row.id}
                      label={row.label}
                      onClose={() => setEditing(null)}
                      value={preview.record[row.id] ?? ''}
                    />
                  )
                }
                key={row.id}
                label={row.label}
                onEdit={() => setEditing(row.id)}
                value={row.value}
              />
            ))}
          </FormCard>
          <Button onClick={tidy} size="l">
            {t('flows.scPpl001.tidy.confirm')}
          </Button>
        </div>
      </BottomSheet>
    </>
  )
}
