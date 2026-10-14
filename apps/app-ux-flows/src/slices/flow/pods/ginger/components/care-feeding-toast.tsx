import { useTranslation } from 'react-i18next'

import { useFlowComponents } from '../../../runtime/flow-context'
import type { CareFeedingToastValue } from '../feeding'
import type { GingerPodComponents } from '../model'

type CareFeedingToastProps = {
  toast: CareFeedingToastValue
  onClose: () => void
}

export const CareFeedingToast = ({ toast, onClose }: CareFeedingToastProps) => {
  const { t } = useTranslation()
  const { Toast } = useFlowComponents<GingerPodComponents>()

  if (!('meal' in toast))
    return <Toast onClose={onClose} title={t(`pods.ginger.careFeeding.toast.${toast.kind}`)} variant="success" />

  return (
    <Toast
      onClose={onClose}
      // "Extra breakfast logged" names the meal mid-sentence.
      title={t(`pods.ginger.careFeeding.toast.${toast.kind}`, {
        meal: t(`pods.ginger.careFeeding.${toast.kind === 'extra' ? 'mealsInline' : 'meals'}.${toast.meal}`),
      })}
      variant={toast.kind === 'undone' ? 'primary' : 'success'}
    />
  )
}
