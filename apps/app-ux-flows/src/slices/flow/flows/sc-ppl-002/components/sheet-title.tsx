import { Trans, useTranslation } from 'react-i18next'

type SheetTitleProps = {
  i18nKey: string
  values?: Record<string, string>
}

// A sheet title whose `<bold>` part, the pod's name, is set in bold.
export const SheetTitle = ({ i18nKey, values }: SheetTitleProps) => {
  const { t } = useTranslation()

  return (
    <Trans
      components={{ bold: <strong className="font-semibold" /> }}
      i18nKey={i18nKey}
      values={{ pod: t('flows.scPpl002.pod.title'), ...values }}
    />
  )
}
