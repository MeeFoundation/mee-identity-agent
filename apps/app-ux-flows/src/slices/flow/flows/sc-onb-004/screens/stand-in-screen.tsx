import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import type { ScOnb004Components, ScOnb004ScreenId } from '../model'

const StandInScreen = ({ kind }: { kind: 'pairing' | 'next' }) => {
  const { t } = useTranslation()
  const { Button } = useFlowComponents<ScOnb004Components>()
  const { back, restart } = useFlowNavigation<ScOnb004ScreenId>()
  const key = (path: string) => `flows.scOnb004.${path}`

  return (
    <div className="flex h-full flex-col justify-end bg-gray-900/40">
      <div className="rounded-t-3xl bg-white px-6 pt-3 pb-8">
        <span className="mx-auto mb-4 block h-1 w-10 rounded-full bg-gray-300" />
        <h2 className="font-semibold text-gray-900 text-xl">
          {kind === 'pairing' ? t(key('standIn.pairingTitle')) : t(key('standIn.nextTitle'))}
        </h2>
        <p className="mt-2 text-gray-600">{t(key('standIn.body'))}</p>
        <div className="mt-6 grid gap-3">
          {kind === 'pairing' ? <Button onClick={back}>{t(key('actions.close'))}</Button> : null}
          <Button onClick={restart} variant="link">
            {t(key('actions.replay'))}
          </Button>
        </div>
      </div>
    </div>
  )
}

export const PairingScreen = () => <StandInScreen kind="pairing" />

export const NextScreen = () => <StandInScreen kind="next" />
