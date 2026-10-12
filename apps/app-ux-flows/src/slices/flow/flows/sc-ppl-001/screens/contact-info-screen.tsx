import { useAtomValue } from 'jotai'
import { PersonVcard } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { toContactInfoFieldRows } from '../../../pods/people/contact-info'
import { useFlowComponents } from '../../../runtime/flow-context'
import { SofiaTopBar } from '../components/sofia-top-bar'
import { contactInfoAtom, type ScPpl001Components } from '../model'

export const ContactInfoScreen = () => {
  const { t, i18n } = useTranslation()
  const { FieldRow, FormCard, PodScreen } = useFlowComponents<ScPpl001Components>()
  const rows = toContactInfoFieldRows(useAtomValue(contactInfoAtom), t, i18n.language)

  return (
    <PodScreen topBar={<SofiaTopBar tab="info" />}>
      <FormCard
        footer={
          rows.length === 0 && <p className="px-1 py-3 text-gray-600 text-sm">{t('pods.people.contactInfo.empty')}</p>
        }
        icon={PersonVcard}
        title={t('pods.people.contactInfo.title')}
      >
        {rows.map((row) => (
          <FieldRow key={row.id} label={row.label} value={row.value} />
        ))}
      </FormCard>
    </PodScreen>
  )
}
