import { BookOpen, FileText, Heart, Home, PawPrint, Plane } from 'lucide-react'
import { type CSSProperties, type PointerEvent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { POD_EXAMPLES, type PodExample } from '../examples'
import { exampleIndexAt, prefersReducedMotion } from '../motion'
import { TourFace } from './tour-face'
import { cn } from '@/shared/lib/cn'

const ICONS = [Plane, Heart, PawPrint, Home, BookOpen]

const rise = (animate: boolean, delayMs: number) =>
  animate
    ? { className: 'animate-onb-rise', style: { animationDelay: `${delayMs}ms` } as CSSProperties }
    : { className: '', style: undefined }

const PhoneCard = ({ animate, example, Icon }: { animate: boolean; example: PodExample; Icon: typeof Plane }) => {
  const { t } = useTranslation()
  const title = rise(animate, 0)
  const people = rise(animate, 180)
  const note = rise(animate, 380)
  const files = rise(animate, 560)
  const form = rise(animate, example.files.length ? 740 : 560)
  const chat = rise(animate, 980)
  const composer = rise(animate, 1120)
  const key = (path: string) => `flows.scOnb004.tour.podAnything.${path}`

  return (
    <div className="flex h-[300px] w-[216px] flex-col rounded-[28px] bg-white p-3 shadow-sm">
      <span className="mx-auto mb-3 h-1 w-8 rounded-full bg-gray-200" />
      <div className="flex items-center gap-2">
        <span className={cn('flex min-w-0 flex-1 items-center gap-2', title.className)} style={title.style}>
          <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-brand-700 text-white">
            <Icon aria-hidden className="size-4" />
          </span>
          <span className="min-w-0 flex-1 truncate font-medium text-gray-900 text-sm">{example.name}</span>
        </span>
        <span className={cn('flex -space-x-1.5', people.className)} style={people.style}>
          {example.members.map((member) => (
            <span className="rounded-full ring-2 ring-white" key={member}>
              <TourFace face={member} size="xs" />
            </span>
          ))}
        </span>
      </div>
      <div className="mt-3 grid gap-2">
        <div className={note.className} style={note.style}>
          <span className="mb-1 block text-gray-500 text-xs">{t(key('noteLabel'))}</span>
          <p className="rounded-[10px] bg-gray-50 px-2 py-1.5 text-gray-800 text-xs">{example.note}</p>
        </div>
        {example.files.length > 0 ? (
          <div className={files.className} style={files.style}>
            <span className="mb-1 block text-gray-500 text-xs">{t(key('filesLabel'))}</span>
            {example.files.map((file) => (
              <span className="flex items-center gap-2 rounded-[10px] bg-gray-50 px-2 py-1.5" key={file}>
                <FileText aria-hidden className="size-3.5 shrink-0 text-gray-500" />
                <span className="min-w-0 truncate text-gray-900 text-xs">{file}</span>
              </span>
            ))}
          </div>
        ) : null}
        {example.form ? (
          <div className={form.className} style={form.style}>
            <span className="mb-1 block text-gray-500 text-xs">{t(key('formLabel'))}</span>
            <span className="flex items-center justify-between gap-2 rounded-[10px] bg-gray-50 px-2 py-1.5 text-xs">
              <span className="text-gray-500">{example.form.label}</span>
              <span className="text-gray-900 tabular-nums">{example.form.value}</span>
            </span>
          </div>
        ) : null}
      </div>
      <div className="mt-auto grid gap-2">
        <div className={cn('flex items-end gap-1.5', chat.className)} style={chat.style}>
          <TourFace face={example.chat.from} size="xs" />
          <span className="rounded-[12px] rounded-bl-[4px] bg-brand-50 px-2.5 py-1.5 text-gray-800 text-xs">
            {example.chat.text}
          </span>
        </div>
        <span
          className={cn('rounded-[10px] bg-gray-50 px-2.5 py-1.5 text-gray-500 text-xs', composer.className)}
          style={composer.style}
        >
          {t(key('message'))}
        </span>
      </div>
    </div>
  )
}

export const PodAnythingScene = () => {
  const { t } = useTranslation()
  const reduced = prefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(reduced)
  const startX = useRef<number | null>(null)
  const example = POD_EXAMPLES[index] ?? POD_EXAMPLES[0]
  const Icon = ICONS[index] ?? Plane

  useEffect(() => {
    if (paused || reduced) return
    const started = Date.now()
    const id = window.setInterval(() => setIndex(exampleIndexAt(Date.now() - started, POD_EXAMPLES.length)), 200)
    return () => window.clearInterval(id)
  }, [paused, reduced])

  const choose = (next: number) => {
    setPaused(true)
    setIndex((next + POD_EXAMPLES.length) % POD_EXAMPLES.length)
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return
    const delta = event.clientX - startX.current
    startX.current = null
    if (delta <= -36) choose(index + 1)
    if (delta >= 36) choose(index - 1)
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-6 max-w-[24ch] text-center font-semibold text-gray-900 text-xl">
        {t('flows.scOnb004.tour.podAnything.headline')}
      </h1>
      <div aria-label={t('flows.scOnb004.tour.podAnything.tabsLabel')} className="mb-3 flex gap-1" role="tablist">
        {POD_EXAMPLES.map((item, i) => (
          <button
            aria-selected={i === index}
            className={cn(
              'min-h-8 rounded-lg px-2.5 text-sm transition-colors duration-200',
              i === index ? 'bg-brand-100 text-brand-700' : 'text-gray-500',
            )}
            key={item.tab}
            onClick={() => choose(i)}
            role="tab"
            type="button"
          >
            {item.tab}
          </button>
        ))}
      </div>
      <div
        className="touch-pan-y select-none"
        onPointerCancel={() => {
          startX.current = null
        }}
        onPointerDown={(event) => {
          startX.current = event.clientX
        }}
        onPointerUp={onPointerUp}
      >
        <div className={reduced ? '' : 'animate-onb-phone-in'} key={index}>
          {example ? <PhoneCard animate={!reduced} example={example} Icon={Icon} /> : null}
        </div>
      </div>
      <div className="mt-3 flex h-12 w-full max-w-[66ch] items-start justify-center">
        {example ? (
          <p
            className={cn('text-pretty text-center text-brand-700 text-sm', reduced ? '' : 'animate-onb-caption-in')}
            key={example.name}
          >
            {example.caption}
          </p>
        ) : null}
      </div>
    </div>
  )
}
