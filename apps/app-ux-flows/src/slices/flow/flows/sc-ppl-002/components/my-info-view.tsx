import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { PlusLg, ThreeDotsVertical } from 'react-bootstrap-icons'
import { Trans, useTranslation } from 'react-i18next'

import { addedByPerson, sharedRole } from '../../../pods/people/member-info'
import { bogdan, memberInitial } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  infoToastAtom,
  memberInfoAtom,
  myInfoAtom,
  type ScPpl002Components,
  type ScPpl002ScreenId,
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
  const title =
    toast.kind === 'removed'
      ? t('flows.scPpl002.infoToast.removed', {
          field: t(`pods.people.memberInfo.fieldNames.${toast.field}`),
          name: memberName(toast.addedBy),
        })
      : t(`flows.scPpl002.infoToast.${toast.kind}`, { field })

  return <Toast onClose={() => setToast(null)} title={title} variant="success" />
}

type MoreActionsRowProps = {
  label: string
  value: string
  onMore: () => void
}

// A detail someone else added: Bogdan can't edit it, only act on it from its "More actions" sheet.
const MoreActionsRow = ({ label, value, onMore }: MoreActionsRowProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-3 py-3 pr-2">
      <div className="flex min-w-0 flex-1 flex-col">
        <dt className="-mb-0.5 text-gray-600 text-xs">{label}</dt>
        <dd className="truncate font-medium text-base text-gray-800">{value}</dd>
      </div>
      <button
        aria-label={t('flows.scPpl002.myInfo.moreActions', { field: label, value })}
        className="-m-2 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg outline-none transition-colors hover:bg-gray-100 focus-visible:ring-3 focus-visible:ring-ring"
        onClick={onMore}
        type="button"
      >
        <ThreeDotsVertical aria-hidden className="text-gray-700" size={16} />
      </button>
    </div>
  )
}

type MyInfoViewProps = {
  // Off while a sheet is open over the screen: a toast only lasts while My info itself is shown.
  showToast?: boolean
}

export const MyInfoView = ({ showToast = false }: MyInfoViewProps) => {
  const { t } = useTranslation()
  const { Button, FieldRow, MemberCard, MemberRow, PodScreen, PodTopBar, SectionLabel } =
    useFlowComponents<ScPpl002Components>()
  const { goToScreen } = useFlowNavigation<ScPpl002ScreenId>()
  const info = useAtomValue(myInfoAtom)
  const memberInfo = useAtomValue(memberInfoAtom)
  const [toast, setToast] = useAtom(infoToastAtom)
  const selectDetail = useSetAtom(selectedDetailIdAtom)
  const memberName = useMemberName()
  const groups = addedByPerson(info)
  const pod = t('flows.scPpl002.pod.title')

  const leaveFor = (screenId: ScPpl002ScreenId) => {
    setToast(null)
    goToScreen(screenId)
  }

  const openDetail = (detailId: string) => {
    selectDetail(detailId)
    leaveFor('suggestion-actions')
  }

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
          avatar={{ letter: memberInitial(bogdan.name) }}
          breadcrumb={[pod]}
          onBack={() => leaveFor('members')}
          onMenu={noop}
          title={t('pods.people.sharing.you', { name: bogdan.name })}
        />
      }
    >
      <section className="flex flex-col gap-3">
        <div className="flex flex-col">
          <SectionLabel>{t('flows.scPpl002.myInfo.shared', { count: info.shared.length })}</SectionLabel>
          <p className="text-gray-600 text-xs">
            <Trans
              components={{ bold: <strong className="font-bold" /> }}
              i18nKey="flows.scPpl002.myInfo.sharedVisibleTo"
              values={{ pod }}
            />
          </p>
        </div>
        <div className="flex flex-col overflow-clip rounded-2xl bg-white shadow-card">
          <dl className="flex flex-col divide-y divide-gray-100 px-4">
            {info.shared.map((detail) => (
              <FieldRow
                key={detail.id}
                label={t(`pods.people.memberInfo.fields.${detail.field}`)}
                onEdit={noop}
                value={detail.value}
              />
            ))}
          </dl>
          <div className="px-2 pt-1 pb-2">
            <Button className="w-full gap-2" onClick={noop} size="l" tone="tertiary" variant="outlined">
              <PlusLg aria-hidden size={20} />
              {t('flows.scPpl002.myInfo.addPersonalInfo')}
            </Button>
          </div>
        </div>
      </section>
      {groups.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex flex-col">
            <SectionLabel>{t('flows.scPpl002.myInfo.addedByOthers')}</SectionLabel>
            <p className="text-gray-600 text-xs">{t('flows.scPpl002.myInfo.addedByOthersHelp')}</p>
          </div>
          {groups.map(({ addedBy, details }) => {
            const name = memberName(addedBy)
            return (
              <MemberCard key={addedBy}>
                <MemberRow
                  avatar={{ letter: memberInitial(name) }}
                  detail={sharedRole(memberInfo[addedBy]) ?? t('pods.people.sharing.canView')}
                  name={name}
                />
                <dl className="flex flex-col divide-y divide-gray-100 px-4">
                  {details.map((detail) => (
                    <MoreActionsRow
                      key={detail.id}
                      label={t(`pods.people.memberInfo.fields.${detail.field}`)}
                      onMore={() => openDetail(detail.id)}
                      value={detail.value}
                    />
                  ))}
                </dl>
              </MemberCard>
            )
          })}
        </section>
      )}
    </PodScreen>
  )
}
