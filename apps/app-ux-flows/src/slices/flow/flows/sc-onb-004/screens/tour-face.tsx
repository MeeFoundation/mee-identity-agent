import { useId } from 'react'

import { cn } from '@/shared/lib/cn'

import { FACES, type FaceId } from '../faces'

export const TourFace = ({
  face,
  size = 'md',
}: {
  face: FaceId
  size?: 'md' | 'sm' | 'xs'
}) => {
  const { cut, hair, skin } = FACES[face]
  const clipId = `tour-face-${useId()}`

  return (
    <svg
      aria-hidden
      className={cn('shrink-0 rounded-full', size === 'xs' ? 'size-5' : size === 'sm' ? 'size-7' : 'size-10')}
      focusable="false"
      viewBox="0 0 40 40"
    >
      <title>Person</title>
      <defs>
        <clipPath id={clipId}>
          <circle cx="20" cy="20" r="20" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect className="fill-brand-100" height="40" width="40" />
        {cut === 'long' ? <rect fill={hair} height="22" rx="9" width="21" x="9.5" y="10" /> : null}
        <ellipse className={face === 'you' ? 'fill-brand-700' : 'fill-brand-700/45'} cx="20" cy="40" rx="14" ry="10" />
        <rect fill={skin} height="6" rx="2" width="6" x="17" y="24" />
        <circle cx="20" cy="18" fill={skin} r="8" />
        {cut === 'short' ? (
          <path d="M12 17.5a8 8 0 0 1 16 0c-2.5-2.6-5.2-3.3-8-3.1-2.8-.2-5.5.5-8 3.1z" fill={hair} />
        ) : null}
        {cut === 'curls' ? (
          <g fill={hair}>
            <circle cx="14.5" cy="13" r="3.4" />
            <circle cx="19" cy="10.5" r="3.6" />
            <circle cx="24" cy="11.5" r="3.5" />
            <circle cx="27" cy="15" r="2.8" />
            <circle cx="12.6" cy="16.5" r="2.4" />
          </g>
        ) : null}
        {cut === 'long' ? <path d="M12 18a8 8 0 0 1 16 0c-1.8-2.8-4.6-4.2-8-4.2s-6.2 1.4-8 4.2z" fill={hair} /> : null}
        {cut === 'bun' ? (
          <g fill={hair}>
            <circle cx="20" cy="7.5" r="3.6" />
            <path d="M12 18a8 8 0 0 1 16 0c-2-2.4-4.8-3.6-8-3.6s-6 1.2-8 3.6z" />
          </g>
        ) : null}
      </g>
    </svg>
  )
}
