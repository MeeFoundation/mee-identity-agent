import { Check, RefreshCw } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/cn'

import type { FaceId } from '../faces'
import { NEW_VET, OLD_VET, type ShareStep, shareStateAt } from '../motion'
import { TourFace } from './tour-face'
import { useElapsed } from './use-elapsed'

const SCENE = { height: 228, width: 320 }

const FlyDot = ({ from, to, lift }: { from: { x: number; y: number }; to: { x: number; y: number }; lift: number }) => {
  const dx = to.x - from.x
  const dy = to.y - from.y
  return (
    <span
      className="absolute z-10 size-3.5 animate-onb-dot-fly rounded-full bg-brand-700 ring-4 ring-brand-100"
      style={
        {
          '--end-x': `${dx}px`,
          '--end-y': `${dy}px`,
          '--mid-x': `${dx / 2}px`,
          '--mid-y': `${Math.min(dy, 0) / 2 - lift}px`,
          left: from.x - 7,
          top: from.y - 7,
        } as CSSProperties
      }
    />
  )
}

const CenterPhone = ({ editing, number, showShare }: { editing: boolean; number: string; showShare: boolean }) => {
  const { t } = useTranslation()
  return (
    <div
      className="absolute top-0 flex flex-col rounded-[20px] bg-white p-3 shadow-sm"
      style={{ height: 212, left: 96, width: 128 }}
    >
      <span className="mx-auto mb-3 h-1 w-7 rounded-full bg-gray-200" />
      <span className="text-gray-900 text-sm">{t('flows.scOnb004.tour.shareOnce.pod')}</span>
      <span
        className={cn(
          'mt-3 rounded-[10px] px-2 py-1.5 transition-colors duration-300',
          editing ? 'bg-brand-50' : 'bg-gray-50',
        )}
      >
        <span className="block text-gray-500 text-xs">{t('flows.scOnb004.tour.shareOnce.vetPhone')}</span>
        <span className="flex h-4 items-center text-gray-900 text-xs tabular-nums">
          {number}
          {editing ? <span className="ms-px h-3 w-px animate-onb-caret bg-brand-700" /> : null}
        </span>
      </span>
      <span className="mt-3 grid gap-1.5">
        <span className="h-1.5 w-full rounded-full bg-gray-200" />
        <span className="h-1.5 w-3/5 rounded-full bg-gray-200" />
      </span>
      {showShare ? (
        <span className="mt-auto animate-onb-share-press self-center rounded-[10px] bg-brand-700 px-4 py-1.5 text-white text-xs">
          {t('flows.scOnb004.tour.shareOnce.share')}
        </span>
      ) : null}
    </div>
  )
}

const SidePerson = ({
  face,
  left,
  name,
  number,
  reduced,
  step,
}: {
  face: FaceId
  left: number
  name: string
  number: string
  reduced: boolean
  step: ShareStep
}) => {
  const { t } = useTranslation()
  const copiesOpen = step !== 'yours' && step !== 'sending' && step !== 'notified'
  const notified = step === 'notified'
  const badge = step === 'updating' || step === 'synced'

  return (
    <div className="absolute top-0 flex flex-col items-center" style={{ left, width: 84 }}>
      <span
        className={cn('mt-2 flex flex-col items-center gap-1', !reduced && notified ? 'animate-onb-face-bump' : '')}
      >
        <TourFace face={face} />
        <span className="text-gray-800 text-xs">{name}</span>
      </span>
      <span className="absolute inset-x-0" style={{ top: 78 }}>
        {notified ? (
          <span className={reduced ? 'block' : 'block animate-onb-pop'}>
            <span
              className={cn(
                'block rounded-[12px] bg-white px-2.5 py-2 shadow-sm',
                reduced ? '' : 'animate-onb-tap-press',
              )}
            >
              <span className="block text-gray-500 text-xs">{t('flows.scOnb004.tour.shareOnce.newPod')}</span>
              <span className="block text-gray-900 text-xs">{t('flows.scOnb004.tour.shareOnce.pod')}</span>
            </span>
          </span>
        ) : null}
        {copiesOpen ? (
          <span
            className={cn(
              'relative block whitespace-nowrap rounded-[12px] bg-white p-2 shadow-sm',
              reduced ? '' : 'animate-onb-card-open',
            )}
          >
            <span className="block text-gray-900 text-xs">{t('flows.scOnb004.tour.shareOnce.pod')}</span>
            <span className="mt-2 block rounded-[8px] bg-gray-50 px-1 py-1">
              <span className="block text-gray-500 text-xs">{t('flows.scOnb004.tour.shareOnce.vetPhone')}</span>
              <span className="flex h-4 items-center text-gray-900 text-xs tabular-nums">
                <span className={reduced ? '' : 'animate-onb-number-pop'} key={number}>
                  {number}
                </span>
              </span>
            </span>
            {badge ? (
              <span
                className={cn(
                  'absolute -top-2.5 -right-2.5 grid size-7 place-items-center rounded-full bg-brand-700 text-white shadow-sm',
                  reduced ? '' : 'animate-onb-pop',
                )}
                key={step}
              >
                {step === 'updating' ? (
                  <RefreshCw aria-hidden className="size-3.5 animate-spin" />
                ) : (
                  <Check aria-hidden className="size-4" />
                )}
              </span>
            ) : null}
          </span>
        ) : null}
      </span>
    </div>
  )
}

export const ShareOnceScene = () => {
  const { t } = useTranslation()
  const { elapsed, reduced } = useElapsed(false)
  const { number, step } = shareStateAt(elapsed, reduced)
  const copyNumber = step === 'synced' ? NEW_VET : OLD_VET
  const editing = step === 'erasing' || step === 'typing'

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-10 max-w-[24ch] text-center font-semibold text-gray-900 text-xl">
        {t('flows.scOnb004.tour.shareOnce.headline')}
      </h1>
      <div className="relative" style={{ height: SCENE.height, width: SCENE.width }}>
        <CenterPhone editing={editing} number={number} showShare={step === 'yours'} />
        <SidePerson
          face="walker"
          left={0}
          name={t('flows.scOnb004.tour.shareOnce.walker')}
          number={copyNumber}
          reduced={reduced}
          step={step}
        />
        <SidePerson
          face="partner"
          left={SCENE.width - 84}
          name={t('flows.scOnb004.tour.shareOnce.partner')}
          number={copyNumber}
          reduced={reduced}
          step={step}
        />
        {!reduced && step === 'sending'
          ? [
              { name: 'walker', x: 42 },
              { name: 'partner', x: 278 },
            ].map((target) => (
              <FlyDot from={{ x: 160, y: 188 }} key={target.name} lift={40} to={{ x: target.x, y: 28 }} />
            ))
          : null}
      </div>
    </div>
  )
}
