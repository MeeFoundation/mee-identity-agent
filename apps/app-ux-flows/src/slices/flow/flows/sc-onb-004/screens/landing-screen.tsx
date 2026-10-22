import { useSetAtom } from 'jotai'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'

import { useFlowComponents, useFlowNavigation } from '../../../runtime/flow-context'
import type { FaceId } from '../faces'
import type { ScOnb004Components, ScOnb004ScreenId } from '../model'
import { skippedTourAtom } from '../model'
import { prefersReducedMotion } from '../motion'
import { ActionStack, FlowPage, Wordmark } from './shell'
import { TourFace } from './tour-face'

const LANDING_FACES: { delay: number; face: FaceId; from: { x: number; y: number }; x: number; y: number }[] = [
  { delay: 650, face: 'sister', from: { x: -40, y: -24 }, x: 18, y: 26 },
  { delay: 870, face: 'friendA', from: { x: 40, y: -10 }, x: 206, y: 70 },
  { delay: 1090, face: 'walker', from: { x: -36, y: 30 }, x: 40, y: 170 },
]

const LandingCluster = () => {
  const reduced = prefersReducedMotion()
  return (
    <div aria-hidden className="relative h-[220px] w-[260px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className={reduced ? '' : 'animate-onb-squash'}>
          <div className={reduced ? '' : 'animate-onb-bob'} style={reduced ? undefined : { animationDelay: '900ms' }}>
            <span className="grid size-28 place-items-center rounded-[34px] bg-brand-100">
              <span className="grid size-16 place-items-center rounded-2xl bg-brand-700">
                <span className="size-7 rounded-md bg-brand-50 ring-2 ring-brand-700" />
              </span>
            </span>
          </div>
        </div>
      </div>
      {LANDING_FACES.map((item, index) => (
        <span className="absolute" key={item.face} style={{ left: item.x, top: item.y }}>
          <span
            className={reduced ? 'block' : 'block animate-onb-pop'}
            style={
              reduced
                ? undefined
                : ({
                    '--from-x': `${item.from.x}px`,
                    '--from-y': `${item.from.y}px`,
                    animationDelay: `${item.delay}ms`,
                  } as CSSProperties)
            }
          >
            <span
              className={
                reduced
                  ? 'block rounded-full ring-4 ring-gray-50'
                  : 'block animate-onb-bob rounded-full ring-4 ring-gray-50'
              }
              style={reduced ? undefined : { animationDelay: `${1400 + 500 * index}ms` }}
            >
              <TourFace face={item.face} />
            </span>
          </span>
        </span>
      ))}
    </div>
  )
}

export const LandingScreen = () => {
  const { t } = useTranslation()
  const { Button } = useFlowComponents<ScOnb004Components>()
  const { goToScreen } = useFlowNavigation<ScOnb004ScreenId>()
  const setSkipped = useSetAtom(skippedTourAtom)
  const key = (path: string) => `flows.scOnb004.${path}`

  return (
    <FlowPage
      footer={
        <ActionStack>
          <Button
            onClick={() => {
              setSkipped(false)
              goToScreen('pod-anything')
            }}
          >
            {t(key('actions.showMeAround'))}
          </Button>
          <Button
            onClick={() => {
              setSkipped(true)
              goToScreen('setup')
            }}
            tone="secondary"
          >
            {t(key('actions.skipToSetup'))}
          </Button>
        </ActionStack>
      }
      top={
        <div className="px-6 pt-7">
          <Wordmark />
        </div>
      }
    >
      <h1 className="mt-8 text-pretty font-semibold text-3xl text-gray-900">{t(key('landing.headline'))}</h1>
      <div className="flex flex-1 items-center justify-center py-8">
        <LandingCluster />
      </div>
    </FlowPage>
  )
}
