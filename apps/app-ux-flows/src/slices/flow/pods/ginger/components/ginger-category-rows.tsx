import { useAtomValue } from 'jotai'
import { Basket, Diagram3, Paperclip, People } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import { type GingerPodComponents, podAtom } from '../model'

const noop = () => {}

type GingerCategoryRowsProps = {
  // Without it the Medical row does nothing, like the other rows.
  onOpenMedical?: () => void
  // Without it there is no Care & Feeding row, as in the flows from before it existed.
  onOpenCareFeeding?: () => void
  careFeedingCount?: number
  // Without it the Members row does nothing.
  onOpenMembers?: () => void
  // Replaces the pod's member count, for a flow where members and invites change.
  memberCount?: number
}

export const GingerCategoryRows = ({
  onOpenMedical = noop,
  onOpenCareFeeding,
  careFeedingCount = 0,
  onOpenMembers = noop,
  memberCount,
}: GingerCategoryRowsProps) => {
  const { t } = useTranslation()
  const { CategoryRow } = useFlowComponents<GingerPodComponents>()
  const pod = useAtomValue(podAtom)

  return (
    <>
      <CategoryRow count={0} icon={Paperclip} label={t('pods.ginger.categories.medical')} onClick={onOpenMedical} />
      {onOpenCareFeeding && (
        <CategoryRow
          count={careFeedingCount}
          icon={Basket}
          label={t('pods.ginger.categories.careFeeding')}
          onClick={onOpenCareFeeding}
        />
      )}
      <CategoryRow count={0} icon={Paperclip} label={t('pods.ginger.categories.attachments')} onClick={noop} />
      <CategoryRow count={0} icon={Diagram3} label={t('pods.ginger.categories.subpods')} onClick={noop} />
      <CategoryRow
        count={memberCount ?? pod.memberCount}
        icon={People}
        label={t('pods.ginger.categories.members')}
        onClick={onOpenMembers}
      />
    </>
  )
}
