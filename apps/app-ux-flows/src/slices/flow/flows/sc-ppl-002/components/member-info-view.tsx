import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import { Pencil, PlusLg, ThreeDotsVertical, Trash3 } from 'react-bootstrap-icons'
import { Trans, useTranslation } from 'react-i18next'

import {
  type AddedDetail,
  addedByPerson,
  detailBy,
  type InfoField,
  infoFields,
  pickableOwnFields,
  sharedRole,
} from '../../../pods/people/member-info'
import { bogdan, memberInitial } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  addMySharedAtom,
  editMySharedAtom,
  infoOf,
  infoToastAtom,
  memberInfoAtom,
  removeMyDetailAboutAtom,
  type ScPpl002Components,
  type ScPpl002ScreenId,
  saveDetailAboutAtom,
  selectedDetailIdAtom,
} from '../model'
import { useMemberName } from './use-member-name'

const noop = () => {}

const InfoToastView = () => {
  const { t } = useTranslation()
  const { Toast } = useFlowComponents<ScPpl002Components>()
  const [toast, setToast] = useAtom(infoToastAtom)
  const memberName = useMemberName()

  if (!toast) return null

  const field = t(`pods.people.memberInfo.fields.${toast.field}`)
  const fieldName = t(`pods.people.memberInfo.fieldNames.${toast.field}`)
  const title = (() => {
    switch (toast.kind) {
      case 'removed':
        return t('flows.scPpl002.infoToast.removed', { field: fieldName, name: memberName(toast.addedBy) })
      case 'addedAbout':
        return t('flows.scPpl002.infoToast.addedAbout', { field, name: memberName(toast.memberId) })
      case 'alreadyShared':
      case 'removedMine':
        return t(`flows.scPpl002.infoToast.${toast.kind}`, { field: fieldName, name: memberName(toast.memberId) })
      default:
        return t(`flows.scPpl002.infoToast.${toast.kind}`, { field })
    }
  })()

  return <Toast onClose={() => setToast(null)} title={title} variant="success" />
}

const rowButtonClass =
  '-m-2 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg outline-none transition-colors hover:bg-gray-100 focus-visible:ring-3 focus-visible:ring-ring'

type AddedRowProps = {
  label: string
  value: string
  // Bogdan's own details about someone else.
  onEdit?: () => void
  onRemove?: () => void
  // A detail about Bogdan, acted on from its "More actions" sheet.
  onMore?: () => void
}

const AddedRow = ({ label, value, onEdit, onRemove, onMore }: AddedRowProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-3 py-3 pr-2">
      <div className="flex min-w-0 flex-1 flex-col">
        <dt className="-mb-0.5 text-gray-600 text-xs">{label}</dt>
        <dd className="truncate font-medium text-base text-gray-800">{value}</dd>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        {onEdit && (
          <button
            aria-label={t('ui.formCard.edit', { field: label })}
            className={rowButtonClass}
            onClick={onEdit}
            type="button"
          >
            <Pencil aria-hidden className="text-gray-700" size={16} />
          </button>
        )}
        {onRemove && (
          <button
            aria-label={t('flows.scPpl002.memberDetail.removeMine', { field: label, value })}
            className={rowButtonClass}
            onClick={onRemove}
            type="button"
          >
            <Trash3 aria-hidden className="text-error-700" size={16} />
          </button>
        )}
        {onMore && (
          <button
            aria-label={t('flows.scPpl002.myInfo.moreActions', { field: label, value })}
            className={rowButtonClass}
            onClick={onMore}
            type="button"
          >
            <ThreeDotsVertical aria-hidden className="text-gray-700" size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

type Editing =
  | { kind: 'shared'; detailId: string; field: InfoField; start: string }
  | { kind: 'mine'; field: InfoField; start: string }
  | { kind: 'add'; field: InfoField }

type DetailEditorProps = {
  editing: Editing
  fields: readonly InfoField[]
  onSave: (field: InfoField, value: string) => void
  onCancel: () => void
}

const DetailEditor = ({ editing, fields, onSave, onCancel }: DetailEditorProps) => {
  const { t } = useTranslation()
  const { InlineFieldEditor, SelectField, TextField } = useFlowComponents<ScPpl002Components>()
  const start = editing.kind === 'add' ? '' : editing.start
  const [field, setField] = useState(editing.field)
  const [draft, setDraft] = useState(start)
  const value = draft.trim()
  const fieldLabel = (option: InfoField) => t(`pods.people.memberInfo.fields.${option}`)

  return (
    <InlineFieldEditor
      onCancel={onCancel}
      onSave={() => onSave(field, value)}
      saveDisabled={value === '' || value === start}
    >
      {editing.kind === 'add' && (
        <SelectField
          label={t('flows.scPpl002.editor.field')}
          onChange={setField}
          options={fields.map((option) => ({ label: fieldLabel(option), value: option }))}
          value={field}
        />
      )}
      <TextField label={fieldLabel(field)} onChange={setDraft} value={draft} />
    </InlineFieldEditor>
  )
}

type MemberInfoViewProps = {
  memberId: string
  // Off while a sheet is open over the screen: a toast only lasts while the screen itself is shown.
  showToast?: boolean
}

// One member's info: what they share, and what others added about them. Only Bogdan's own info changes here;
// on anyone else's screen his edits become his own details about them.
export const MemberInfoView = ({ memberId, showToast = false }: MemberInfoViewProps) => {
  const { t } = useTranslation()
  const { Button, FieldRow, MemberCard, MemberRow, PodScreen, PodTopBar, SectionLabel } =
    useFlowComponents<ScPpl002Components>()
  const { complete, goToScreen } = useFlowNavigation<ScPpl002ScreenId>()
  const memberInfo = useAtomValue(memberInfoAtom)
  const [toast, setToast] = useAtom(infoToastAtom)
  const selectDetail = useSetAtom(selectedDetailIdAtom)
  const editMyShared = useSetAtom(editMySharedAtom)
  const addMyShared = useSetAtom(addMySharedAtom)
  const saveDetailAbout = useSetAtom(saveDetailAboutAtom)
  const removeMyDetailAbout = useSetAtom(removeMyDetailAboutAtom)
  const memberName = useMemberName()
  const [editing, setEditing] = useState<Editing | null>(null)

  const isMe = memberId === bogdan.id
  const canRemove = !isMe && bogdan.role === 'owner'
  const info = infoOf(memberInfo, memberId)
  const name = memberName(memberId)
  const groups = addedByPerson(info)
  const pod = t('flows.scPpl002.pod.title')
  const fieldLabel = (field: InfoField) => t(`pods.people.memberInfo.fields.${field}`)
  const personName = (personId: string) =>
    personId === bogdan.id ? t('pods.people.sharing.you', { name: bogdan.name }) : memberName(personId)

  const leaveFor = (screenId: ScPpl002ScreenId) => {
    setToast(null)
    goToScreen(screenId)
  }

  const openDetail = (detailId: string) => {
    selectDetail(detailId)
    leaveFor('suggestion-actions')
  }

  const startEditing = (next: Editing) => {
    setToast(null)
    setEditing(next)
  }

  const editShared = (detailId: string, field: InfoField, value: string) =>
    startEditing({
      detailId,
      field,
      kind: 'shared',
      start: isMe ? value : (detailBy(info, bogdan.id, field)?.value ?? value),
    })

  const save = (field: InfoField, value: string) => {
    if (!editing) return
    setEditing(null)
    if (!isMe) {
      if (saveDetailAbout(memberId, field, value) === 'added') complete({ showCompletionView: false })
      return
    }
    if (editing.kind === 'shared') editMyShared(editing.detailId, value)
    else addMyShared(field, value)
  }

  const addFields = isMe ? pickableOwnFields(info) : infoFields
  const firstAddField = addFields[0]
  const addLabel = isMe
    ? t('flows.scPpl002.myInfo.addPersonalInfo')
    : t('flows.scPpl002.memberDetail.addInfo', { name })
  const editor = (current: Editing) => (
    <DetailEditor editing={current} fields={addFields} onCancel={() => setEditing(null)} onSave={save} />
  )

  return (
    <PodScreen
      bottomBar={
        showToast &&
        toast && (
          <div className="px-3 pb-[calc(0.75rem+var(--home-indicator-h))]">
            <InfoToastView />
          </div>
        )
      }
      topBar={
        <PodTopBar
          avatar={{ letter: memberInitial(name) }}
          breadcrumb={[pod]}
          onBack={() => leaveFor('members')}
          onMenu={noop}
          title={isMe ? t('pods.people.sharing.you', { name }) : name}
        />
      }
    >
      <section className="flex flex-col gap-3">
        <div className="flex flex-col">
          <SectionLabel>
            {isMe
              ? t('flows.scPpl002.myInfo.shared', { count: info.shared.length })
              : t('flows.scPpl002.memberDetail.shared', { count: info.shared.length, name })}
          </SectionLabel>
          <p className="text-gray-600 text-xs">
            {isMe ? (
              <Trans
                components={{ bold: <strong className="font-bold" /> }}
                i18nKey="flows.scPpl002.myInfo.sharedVisibleTo"
                values={{ pod }}
              />
            ) : (
              t('flows.scPpl002.memberDetail.sharedHelp', { name })
            )}
          </p>
        </div>
        <div className="flex flex-col overflow-clip rounded-2xl bg-white shadow-card">
          {info.shared.length === 0 && !isMe && (
            <p className="px-4 pt-3 text-base text-gray-600">
              {t('flows.scPpl002.memberDetail.nothingShared', { name })}
            </p>
          )}
          <dl className="flex flex-col divide-y divide-gray-100 px-4">
            {info.shared.map((detail) => (
              <FieldRow
                editor={editing?.kind === 'shared' && editing.detailId === detail.id ? editor(editing) : undefined}
                key={detail.id}
                label={fieldLabel(detail.field)}
                onEdit={() => editShared(detail.id, detail.field, detail.value)}
                value={detail.value}
              />
            ))}
            {editing?.kind === 'add' && <FieldRow editor={editor(editing)} label={addLabel} value="" />}
          </dl>
          {editing?.kind !== 'add' && firstAddField && (
            <div className="px-2 pt-1 pb-2">
              <Button
                className="w-full gap-2"
                onClick={() => startEditing({ field: firstAddField, kind: 'add' })}
                size="l"
                tone="tertiary"
                variant="outlined"
              >
                <PlusLg aria-hidden size={20} />
                {addLabel}
              </Button>
            </div>
          )}
        </div>
      </section>
      {groups.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex flex-col">
            <SectionLabel>
              {isMe
                ? t('flows.scPpl002.myInfo.addedByOthers')
                : t('flows.scPpl002.memberDetail.addedByOthers', { name })}
            </SectionLabel>
            <p className="text-gray-600 text-xs">
              {isMe ? (
                t('flows.scPpl002.myInfo.addedByOthersHelp')
              ) : (
                <Trans
                  components={{ bold: <strong className="font-bold" /> }}
                  i18nKey="flows.scPpl002.memberDetail.addedByOthersHelp"
                  values={{ pod }}
                />
              )}
            </p>
          </div>
          {groups.map(({ addedBy, details }) => (
            <MemberCard key={addedBy}>
              <MemberRow
                avatar={{ letter: memberInitial(memberName(addedBy)) }}
                detail={sharedRole(memberInfo[addedBy]) ?? t('pods.people.sharing.canView')}
                name={personName(addedBy)}
              />
              <dl className="flex flex-col divide-y divide-gray-100 px-4">
                {details.map((detail: AddedDetail) => {
                  const label = fieldLabel(detail.field)
                  const mine = !isMe && addedBy === bogdan.id
                  if (mine && editing?.kind === 'mine' && editing.field === detail.field)
                    return <FieldRow editor={editor(editing)} key={detail.id} label={label} value={detail.value} />
                  return (
                    <AddedRow
                      key={detail.id}
                      label={label}
                      onEdit={
                        mine
                          ? () => startEditing({ field: detail.field, kind: 'mine', start: detail.value })
                          : undefined
                      }
                      onMore={isMe ? () => openDetail(detail.id) : undefined}
                      onRemove={mine ? () => removeMyDetailAbout(memberId, detail.field) : undefined}
                      value={detail.value}
                    />
                  )
                })}
              </dl>
            </MemberCard>
          ))}
        </section>
      )}
      {canRemove && (
        <Button
          className="mt-auto"
          onClick={() => leaveFor('remove-confirm')}
          size="l"
          tone="danger"
          variant="outlined"
        >
          {t('flows.scPpl002.memberDetail.remove')}
        </Button>
      )}
    </PodScreen>
  )
}
