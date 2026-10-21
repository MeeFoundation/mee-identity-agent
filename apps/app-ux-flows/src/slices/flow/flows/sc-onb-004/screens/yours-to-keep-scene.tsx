import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/cn'

import { BEAT3_CLOSE_MS, BEAT3_DIM_MS, BEAT3_LINE_DELAYS_MS, prefersReducedMotion } from '../motion'

const LINES = ['noAccounts', 'noDataCenters', 'noAds', 'noTracking'] as const

export const YoursToKeepScene = () => {
  const { t } = useTranslation()
  const reduced = prefersReducedMotion()

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="sr-only">{t('flows.scOnb004.tour.yoursToKeep.headline')}</h1>
      <ul className="grid gap-1">
        {LINES.map((line, index) => (
          <li
            className={cn('font-semibold text-xl', reduced ? '' : 'animate-onb-rise')}
            key={line}
            style={reduced ? undefined : { animationDelay: `${BEAT3_LINE_DELAYS_MS[index]}ms` }}
          >
            <span
              className={cn(
                'block',
                reduced ? 'text-gray-400' : 'animate-onb-line-dim text-gray-900',
              )}
              style={reduced ? undefined : { animationDelay: `${BEAT3_DIM_MS}ms` }}
            >
              {t(`flows.scOnb004.tour.yoursToKeep.${line}`)}
            </span>
          </li>
        ))}
      </ul>
      <p
        className={cn(
          'mt-6 max-w-[16ch] text-balance font-semibold text-2xl text-brand-700',
          reduced ? '' : 'animate-onb-final-line',
        )}
        style={reduced ? undefined : { animationDelay: `${BEAT3_CLOSE_MS}ms` }}
      >
        {t('flows.scOnb004.tour.yoursToKeep.closing')}
      </p>
    </div>
  )
}
