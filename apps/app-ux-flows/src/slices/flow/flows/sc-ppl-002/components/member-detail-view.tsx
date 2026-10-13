import { CheckLg } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { formatLongDate, type Member, memberInitial, memberJoinedOn } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import type { ScPpl002Components, ScPpl002ScreenId } from '../model'

const noop = () => {}

type MemberDetailViewProps = {
  member: Member
  today: Date
}

export const MemberDetailView = ({ member, today }: MemberDetailViewProps) => {
  const { t, i18n } = useTranslation()
  const { Button, PodScreen, PodTopBar } = useFlowComponents<ScPpl002Components>()
  const { goToScreen } = useFlowNavigation<ScPpl002ScreenId>()

  return (
    <PodScreen
      topBar={
        <PodTopBar
          avatar={{ letter: memberInitial(member.name) }}
          onBack={() => goToScreen('members')}
          onMenu={noop}
          subtitle={t('pods.people.sharing.canView')}
          title={member.name}
        />
      }
    >
      <dl className="flex flex-col rounded-2xl bg-white px-4 py-3 shadow-card">
        <dt className="text-gray-600 text-xs">{t('flows.scPpl002.memberDetail.joined')}</dt>
        <dd className="font-medium text-base text-gray-800">
          {formatLongDate(memberJoinedOn(member, today), i18n.language)}
        </dd>
      </dl>
      <section className="flex flex-col gap-2 rounded-2xl bg-white px-4 py-3 shadow-card">
        <h2 className="font-medium text-base text-gray-900">{t('flows.scPpl002.memberDetail.canDo.title')}</h2>
        <ul className="flex flex-col gap-1.5">
          {(['view', 'chat'] as const).map((ability) => (
            <li className="flex items-center gap-2 text-gray-700 text-sm" key={ability}>
              <CheckLg aria-hidden className="shrink-0 text-success-700" size={16} />
              {t(`flows.scPpl002.memberDetail.canDo.${ability}`)}
            </li>
          ))}
        </ul>
      </section>
      <Button
        className="mt-auto"
        onClick={() => goToScreen('remove-confirm')}
        size="l"
        tone="danger"
        variant="outlined"
      >
        {t('flows.scPpl002.memberDetail.remove')}
      </Button>
    </PodScreen>
  )
}
