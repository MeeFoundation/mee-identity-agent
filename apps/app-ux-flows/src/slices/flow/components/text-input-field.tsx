import { useId } from 'react'
import { useTranslation } from 'react-i18next'

import type { FlowComponentRuntimeProps } from '../model'

type TextInputFieldProps = FlowComponentRuntimeProps & {
  field: string
  labelKey: string
}

export const TextInputField = ({ data, setValue, field, labelKey }: TextInputFieldProps) => {
  const { t } = useTranslation()
  const inputId = useId()

  return (
    <div>
      <label htmlFor={inputId}>{t(labelKey)}</label>
      <input id={inputId} onChange={(event) => setValue(field, event.target.value)} value={data[field] ?? ''} />
    </div>
  )
}
