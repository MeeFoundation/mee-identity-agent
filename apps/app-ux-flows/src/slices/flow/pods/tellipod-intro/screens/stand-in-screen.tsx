import { useLayoutEffect } from 'react'
import { ArrowRight, Cloud, Phone } from 'react-bootstrap-icons'
import { useTranslation } from 'react-i18next'

import { useFlowNavigation } from '../../../runtime/flow-context'
import type { IntroScreenId } from '../model'
import { Button } from '@/shared/ui/button'
import telliAssistantIcon from '@/shared/ui/icons/telli-assistant.svg'

type StandInId = Extract<IntroScreenId, 'telli-handoff' | 'existing-device' | 'restore'>

const standInKeys: Record<StandInId, string> = {
  'existing-device': 'existingDevice',
  restore: 'restore',
  'telli-handoff': 'telliHandoff',
}

const StandInIcon = ({ standIn }: { standIn: StandInId }) => {
  if (standIn === 'telli-handoff')
    return <img alt="" className="size-7" height={28} src={telliAssistantIcon} width={28} />
  const Icon = standIn === 'restore' ? Cloud : Phone
  return <Icon aria-hidden size={26} />
}

// Stands in for screens that follow the intro in the real app, which this prototype doesn't build.
const StandInScreen = ({ standIn }: { standIn: StandInId }) => {
  const { t } = useTranslation()
  const navigation = useFlowNavigation<IntroScreenId>()
  const key = (path: string) => `pods.tellipodIntro.standIns.${standInKeys[standIn]}.${path}`

  // Reaching Telli is the goal, however the reviewer got here.
  useLayoutEffect(() => {
    if (standIn === 'telli-handoff') navigation.complete({ showCompletionView: false })
  }, [standIn, navigation])

  return (
    <div className="flex h-full animate-intro-fade flex-col items-center justify-center gap-4 bg-white px-8 text-center">
      <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700 text-xs uppercase tracking-wide">
        {t('pods.tellipodIntro.standIns.badge')}
      </span>
      <span className="flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <StandInIcon standIn={standIn} />
      </span>
      <h1 className="font-semibold text-gray-900 text-xl">{t(key('title'))}</h1>
      <p className="max-w-[300px] text-gray-600 text-sm">{t(key('body'))}</p>
      <Button className="gap-1.5" onClick={navigation.restart} size="m" variant="link">
        {t('pods.tellipodIntro.standIns.replay')}
        <ArrowRight aria-hidden size={14} />
      </Button>
    </div>
  )
}

export const TelliHandoffScreen = () => <StandInScreen standIn="telli-handoff" />

export const ExistingDeviceScreen = () => <StandInScreen standIn="existing-device" />

export const RestoreScreen = () => <StandInScreen standIn="restore" />
