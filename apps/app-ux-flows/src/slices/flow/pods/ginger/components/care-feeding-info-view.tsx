import type { ReactNode } from 'react'
import { CardText } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import type { GingerPodComponents } from '../model'
import { GingerCategoryRows } from './ginger-category-rows'

const noop = () => {}

type CareFeedingInfoViewProps = {
  topBar: ReactNode
  onOpenCareFeeding: () => void
  careFeedingCount: number
}

// Ginger's Info tab with the Care & Feeding row; the Pet form and the other rows do nothing.
export const CareFeedingInfoView = ({ topBar, onOpenCareFeeding, careFeedingCount }: CareFeedingInfoViewProps) => {
  const { t } = useTranslation()
  const { Divider, PodScreen, RecordRow, SectionLabel } = useFlowComponents<GingerPodComponents>()

  return (
    <PodScreen topBar={topBar}>
      <div className="flex flex-col gap-3">
        <section className="flex flex-col gap-3">
          <SectionLabel>{t('pods.ginger.forms.title')}</SectionLabel>
          <RecordRow icon={CardText} onClick={noop} title={t('pods.catalog.forms.pet')} />
        </section>
        <Divider />
        <GingerCategoryRows careFeedingCount={careFeedingCount} onOpenCareFeeding={onOpenCareFeeding} />
      </div>
    </PodScreen>
  )
}
