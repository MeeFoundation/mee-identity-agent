import { useTranslation } from 'react-i18next'

import type { FlowComponentRuntimeProps } from '../model'

type ContinueButtonProps = FlowComponentRuntimeProps & {
  labelKey: string
  requiredFields?: readonly string[]
}

export const ContinueButton = ({ data, completeScreen, labelKey, requiredFields = [] }: ContinueButtonProps) => {
  const { t } = useTranslation()
  const isBlocked = requiredFields.some((field) => (data[field] ?? '').trim() === '')

  return (
    <button disabled={isBlocked} onClick={completeScreen} type="button">
      {t(labelKey)}
    </button>
  )
}
