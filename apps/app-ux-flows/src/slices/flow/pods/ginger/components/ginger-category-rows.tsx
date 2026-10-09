import { useAtomValue } from 'jotai'
import { Diagram3, Paperclip, People } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import { type GingerPodComponents, podAtom } from '../model'

const noop = () => {}

type GingerCategoryRowsProps = {
  // Without it the Medical row does nothing, like the other rows.
  onOpenMedical?: () => void
}

export const GingerCategoryRows = ({ onOpenMedical = noop }: GingerCategoryRowsProps) => {
  const { t } = useTranslation()
  const { CategoryRow } = useFlowComponents<GingerPodComponents>()
  const pod = useAtomValue(podAtom)

  return (
    <>
      <CategoryRow count={0} icon={Paperclip} label={t('pods.ginger.categories.medical')} onClick={onOpenMedical} />
      <CategoryRow count={0} icon={Paperclip} label={t('pods.ginger.categories.attachments')} onClick={noop} />
      <CategoryRow count={0} icon={Diagram3} label={t('pods.ginger.categories.subpods')} onClick={noop} />
      <CategoryRow count={pod.memberCount} icon={People} label={t('pods.ginger.categories.members')} onClick={noop} />
    </>
  )
}
