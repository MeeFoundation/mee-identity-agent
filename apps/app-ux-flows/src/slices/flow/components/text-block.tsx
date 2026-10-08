import { useTranslation } from 'react-i18next'

import type { FlowComponentRuntimeProps } from '../model'

type TextBlockProps = FlowComponentRuntimeProps & {
  textKey: string
}

export const TextBlock = ({ data, textKey }: TextBlockProps) => {
  const { t } = useTranslation()

  return <p>{t(textKey, data)}</p>
}
