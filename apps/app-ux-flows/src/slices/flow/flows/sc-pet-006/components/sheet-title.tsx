import { useAtomValue } from 'jotai'
import { Trans } from 'react-i18next'

import { podAtom } from '../../../pods/ginger/model'

type SheetTitleProps = {
  i18nKey: string
  values?: Record<string, string>
}

// A sheet title whose `<bold>` part, the pod's name, is set in bold.
export const SheetTitle = ({ i18nKey, values }: SheetTitleProps) => {
  const pod = useAtomValue(podAtom)

  return (
    <Trans
      components={{ bold: <strong className="font-semibold" /> }}
      i18nKey={i18nKey}
      values={{ pod: pod.name, ...values }}
    />
  )
}
