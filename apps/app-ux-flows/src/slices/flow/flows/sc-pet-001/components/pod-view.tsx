import type { ReactNode } from 'react'
import { CardText, Diagram3, Paperclip, People } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { narrowerCategories } from '../../../pods/catalog/categories'
import type { PodInstance } from '../../../pods/catalog/create-pod'
import { findTemplate, formLabelKey } from '../../../pods/catalog/templates'
import { categoryIcon } from '../../../pods/category-icons'
import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import type { ScPet001Components, ScPet001ScreenId } from '../model'
import { CategoryCell } from './category-cell'

const noop = () => {}

type PodTab = 'notes' | 'chat' | 'info'

type PodViewProps = {
  pod: PodInstance
  // Shown above the pod's structure, e.g. a template suggestion.
  suggestion?: ReactNode
}

// A pod's Info tab, driven only by the pod record: its template decides which structure is shown.
export const PodView = ({ pod, suggestion }: PodViewProps) => {
  const { t } = useTranslation()
  const { CategoryRow, Divider, EmptyStateCard, PodScreen, PodTopBar, SectionLabel, SegmentedTabs } =
    useFlowComponents<ScPet001Components>()
  const { goToScreen } = useFlowNavigation<ScPet001ScreenId>()
  const structureLabelKey = pod.category ? findTemplate(pod.category)?.structureLabelKey : undefined
  const subpods = pod.category ? narrowerCategories(pod.category) : []

  return (
    <PodScreen
      topBar={
        <PodTopBar
          avatar={{ letter: pod.avatarLetter }}
          breadcrumb={pod.breadcrumb}
          breadcrumbIcon={pod.category ? categoryIcon(pod.category) : undefined}
          // Home, not history: going back in history would reopen the New Pod sheet the pod came from.
          onBack={() => goToScreen('home')}
          onMenu={noop}
          tabs={
            <SegmentedTabs<PodTab>
              items={[
                { label: t('flows.scPet001.pod.tabs.notes'), value: 'notes' },
                { label: t('flows.scPet001.pod.tabs.chat'), value: 'chat' },
                { label: t('flows.scPet001.pod.tabs.info'), value: 'info' },
              ]}
              onSelect={noop}
              value="info"
            />
          }
          title={pod.name}
        />
      }
    >
      <div className="flex flex-col gap-3">
        {suggestion}
        {structureLabelKey ? (
          <section className="flex flex-col gap-3">
            <SectionLabel>{t(structureLabelKey)}</SectionLabel>
            {pod.forms.map((form) => (
              <CategoryCell icon={CardText} key={form.shape} label={t(formLabelKey(form.shape) ?? form.shape)} />
            ))}
            {subpods.map((category) => (
              <CategoryCell icon={Diagram3} key={category.iri} label={category.label} />
            ))}
          </section>
        ) : (
          <section className="flex flex-col gap-3">
            <SectionLabel>{t('flows.scPet001.pod.forms')}</SectionLabel>
            <EmptyStateCard
              action={{ label: t('flows.scPet001.pod.addForm'), onAction: noop }}
              message={t('flows.scPet001.pod.emptyMessage')}
              title={t('flows.scPet001.pod.emptyTitle')}
            />
          </section>
        )}
        <Divider />
        <CategoryRow count={0} icon={Paperclip} label={t('flows.scPet001.pod.attachments')} onClick={noop} />
        <CategoryRow count={0} icon={Diagram3} label={t('flows.scPet001.pod.subpods')} onClick={noop} />
        <CategoryRow count={pod.memberCount} icon={People} label={t('flows.scPet001.pod.members')} onClick={noop} />
      </div>
    </PodScreen>
  )
}
