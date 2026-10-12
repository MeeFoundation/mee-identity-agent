import { useAtomValue, useSetAtom } from 'jotai'
import { type ReactNode, useEffect, useId, useRef, useState } from 'react'
import { Capsule } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { MedicationRow } from '../../../pods/ginger/components/medication-row'
import { toMedicationSummary } from '../../../pods/ginger/medication-fields'
import { medicationAtom } from '../../../pods/ginger/model'
import { useFlowAnalytics, useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import {
  type ExpPet004Components,
  type ExpPet004Events,
  type ExpPet004ScreenId,
  medicationShortcutAtom,
  scheduleDraftAtom,
  startEditAtom,
} from '../model'
import { MedicationFormFields } from './medication-form-fields'
import { ScheduleField } from './schedule-field'

type ExpandedCardProps = {
  title: string
  children: ReactNode
  footer?: ReactNode
}

// The medication item opened up in place on the Medical screen; focus moves into it.
const ExpandedCard = ({ title, children, footer }: ExpandedCardProps) => {
  const titleId = useId()
  const cardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    cardRef.current?.focus()
  }, [])

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col overflow-clip rounded-2xl bg-white shadow-card outline-none focus-visible:ring-3 focus-visible:ring-ring"
      ref={cardRef}
      tabIndex={-1}
    >
      <div className="flex items-center gap-2 border-gray-200 border-b py-2 pr-4 pl-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
          <Capsule aria-hidden className="text-brand-500" size={18} />
        </span>
        <h3 className="font-medium text-base text-gray-900" id={titleId}>
          {title}
        </h3>
      </div>
      {children}
      {footer && <div className="px-2 pt-1 pb-2">{footer}</div>}
    </section>
  )
}

type ExpandedProps = {
  onCollapse: () => void
}

// Variant B: the whole form, every field editable in place, without leaving the list.
const ExpandedForm = ({ onCollapse }: ExpandedProps) => {
  const { t, i18n } = useTranslation()
  const { Button } = useFlowComponents<ExpPet004Components>()
  const { goToScreen } = useFlowNavigation<ExpPet004ScreenId>()
  const { track } = useFlowAnalytics<ExpPet004Events>()
  const medication = useAtomValue(medicationAtom)
  const draft = useAtomValue(scheduleDraftAtom)

  const close = () => {
    track('medication_edit_cancelled', { changed: draft !== medication.frequencyPerDay, entry_point: 'list_edit' })
    onCollapse()
  }

  return (
    <ExpandedCard
      footer={
        <Button className="w-full" onClick={close} size="m" tone="tertiary" variant="link">
          {t('flows.expPet004.form.close')}
        </Button>
      }
      title={toMedicationSummary(medication, t, i18n.language).name}
    >
      <dl className="flex flex-col px-3">
        <MedicationFormFields entryPoint="list_edit" onScheduleSaved={() => goToScreen('medication-updated')} />
      </dl>
    </ExpandedCard>
  )
}

// Variant C: only the schedule, opened straight into edit mode.
const ExpandedSchedule = ({ onCollapse }: ExpandedProps) => {
  const { t, i18n } = useTranslation()
  const { goToScreen } = useFlowNavigation<ExpPet004ScreenId>()
  const summary = toMedicationSummary(useAtomValue(medicationAtom), t, i18n.language)

  return (
    <ExpandedCard title={t('flows.expPet004.medication.changeSchedule')}>
      <div className="flex flex-col gap-3 p-4">
        <p className="font-medium text-base text-gray-900">
          {t('flows.expPet004.editor.context', { dose: summary.dose, name: summary.name })}
        </p>
        <ScheduleField onCancel={onCollapse} onSaved={() => goToScreen('medication-updated')} />
      </div>
    </ExpandedCard>
  )
}

// The pod's one medication on the Medical screen, with the variant's shortcut into editing under its summary.
export const MedicationItem = () => {
  const { t } = useTranslation()
  const { goToScreen } = useFlowNavigation<ExpPet004ScreenId>()
  const { track } = useFlowAnalytics<ExpPet004Events>()
  const shortcut = useAtomValue(medicationShortcutAtom)
  const startEdit = useSetAtom(startEditAtom)
  const [expanded, setExpanded] = useState(false)

  const openDetails = () => {
    track('medication_viewed')
    goToScreen('medication')
  }

  const expand = (entryPoint: 'list_edit' | 'inline_schedule') => {
    track('medication_edit_started', { entry_point: entryPoint })
    startEdit(entryPoint)
    setExpanded(true)
  }

  if (expanded && shortcut === 'edit') return <ExpandedForm onCollapse={() => setExpanded(false)} />
  if (expanded && shortcut === 'change-schedule') return <ExpandedSchedule onCollapse={() => setExpanded(false)} />

  const action =
    shortcut === 'edit'
      ? { label: t('flows.expPet004.medication.edit'), onClick: () => expand('list_edit') }
      : shortcut === 'change-schedule'
        ? { label: t('flows.expPet004.medication.changeSchedule'), onClick: () => expand('inline_schedule') }
        : undefined

  return <MedicationRow action={action} onOpen={openDetails} />
}
