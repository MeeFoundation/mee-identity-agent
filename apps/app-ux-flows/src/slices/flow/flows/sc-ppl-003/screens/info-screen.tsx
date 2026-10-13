import { Diagram3, Paperclip, People } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { SofiaFormsCard } from '../../../pods/people/components/sofia-forms-card'
import { memberCount } from '../../../pods/people/sharing'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { SharedPodTopBar } from '../components/shared-pod-top-bar'
import { podMembers, type ScPpl003Components, type ScPpl003ScreenId } from '../model'

const noop = () => {}

export const InfoScreen = () => {
  const { t } = useTranslation()
  const { CategoryRow, Divider, PodScreen, SectionLabel } = useFlowComponents<ScPpl003Components>()
  const { goToScreen } = useFlowNavigation<ScPpl003ScreenId>()

  return (
    <PodScreen topBar={<SharedPodTopBar tab="info" />}>
      <div className="flex flex-col gap-3">
        <section className="flex flex-col gap-3">
          <SectionLabel>{t('pods.people.forms.title')}</SectionLabel>
          <SofiaFormsCard onOpenContactInfo={() => goToScreen('contact-info')} onOpenMedical={noop} />
        </section>
        <Divider />
        <CategoryRow count={0} icon={Paperclip} label={t('pods.people.categories.attachments')} onClick={noop} />
        <CategoryRow count={0} icon={Diagram3} label={t('pods.people.categories.subpods')} onClick={noop} />
        <CategoryRow
          count={memberCount(podMembers, [])}
          icon={People}
          label={t('pods.people.categories.members')}
          onClick={() => goToScreen('members')}
        />
      </div>
    </PodScreen>
  )
}
