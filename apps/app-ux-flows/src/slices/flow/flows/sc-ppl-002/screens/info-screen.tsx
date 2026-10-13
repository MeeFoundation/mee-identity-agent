import { useAtomValue } from 'jotai'
import { Diagram3, Paperclip, People, Tag } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { SofiaFormsCard } from '../../../pods/people/components/sofia-forms-card'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { SofiaPodTopBar } from '../components/sofia-pod-top-bar'
import { memberCountAtom, type ScPpl002Components, type ScPpl002ScreenId } from '../model'

const noop = () => {}

export const InfoScreen = () => {
  const { t } = useTranslation()
  const { CategoryRow, Divider, PodScreen, SectionLabel } = useFlowComponents<ScPpl002Components>()
  const { goToScreen } = useFlowNavigation<ScPpl002ScreenId>()
  const count = useAtomValue(memberCountAtom)

  return (
    <PodScreen
      topBar={
        <SofiaPodTopBar
          subtitle={
            <>
              <Tag aria-hidden className="shrink-0" size={14} />
              <span>{t('flows.scPpl002.pod.suggestCategory')}</span>
            </>
          }
          tab="info"
        />
      }
    >
      <div className="flex flex-col gap-3">
        <section className="flex flex-col gap-3">
          <SectionLabel>{t('pods.people.forms.title')}</SectionLabel>
          <SofiaFormsCard onCreateForm={noop} onOpenContactInfo={noop} onOpenMedical={noop} />
        </section>
        <Divider />
        <CategoryRow count={0} icon={Paperclip} label={t('pods.people.categories.attachments')} onClick={noop} />
        <CategoryRow
          badge={
            <span className="rounded-full border border-error-200 bg-error-50 px-2 font-medium text-error-700 text-xs leading-5">
              {t('flows.scPpl002.info.suggestions', { count: 2 })}
            </span>
          }
          count={0}
          icon={Diagram3}
          label={t('pods.people.categories.subpods')}
          onClick={noop}
        />
        <CategoryRow
          count={count}
          icon={People}
          label={t('pods.people.categories.members')}
          onClick={() => goToScreen('members')}
        />
      </div>
    </PodScreen>
  )
}
