import { PersonVcard } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { toContactInfoFieldRows } from '../../../pods/people/contact-info'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import { SharedPodTopBar } from '../components/shared-pod-top-bar'
import { type ScPpl003Components, sofiaContact } from '../model'

export const ContactInfoScreen = () => {
  const { t, i18n } = useTranslation()
  const { FieldRow, FormCard, PodScreen } = useFlowComponents<ScPpl003Components>()
  const { back } = useFlowNavigation()
  const rows = toContactInfoFieldRows(sofiaContact, t, i18n.language)

  return (
    <PodScreen topBar={<SharedPodTopBar onBack={back} subtitle={t('pods.people.contactInfo.title')} />}>
      <FormCard icon={PersonVcard} title={t('pods.people.contactInfo.title')}>
        {rows.map((row) => (
          <FieldRow key={row.id} label={row.label} value={row.value} />
        ))}
      </FormCard>
    </PodScreen>
  )
}
