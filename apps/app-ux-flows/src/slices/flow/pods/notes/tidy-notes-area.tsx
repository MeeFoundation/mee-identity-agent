import { Fragment, type MouseEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { NotesToolbar } from './notes-toolbar'
import type { NoteBlock, RecognisedLine, RecognisedStatus } from './tidy'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'

const PULSE_MS = 1000

// Shared by the painted text and the textarea above it, so both wrap the same way.
const textClassName = 'col-start-1 row-start-1 whitespace-pre-wrap break-words text-base leading-6'

const highlightClassName: Record<RecognisedStatus, string> = {
  known: 'bg-warning-50 ring-warning-300',
  new: 'bg-brand-50 ring-brand-300',
}

const hashtagPattern = /(#[\p{L}\p{N}_]+)/u

const PaintedLine = ({ line }: { line: string }) =>
  line.split(hashtagPattern).map((part, index) =>
    index % 2 === 1 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: parts of one line never move
      <span className="text-purple-700" key={index}>
        {part}
      </span>
    ) : (
      part
    ),
  )

type TextBlockProps = {
  text: string
  highlights: ReadonlyMap<number, RecognisedStatus>
  onChange: (text: string) => void
}

// The textarea's own text is transparent; the layer under it paints the text, hashtags and highlights.
const TextBlock = ({ text, highlights, onChange }: TextBlockProps) => {
  const { t } = useTranslation()

  return (
    <div className="grid">
      <div aria-hidden className={cn(textClassName, 'text-gray-800')}>
        {text.split('\n').map((line, index) => {
          const status = highlights.get(index)
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: a line is identified by its position
            <Fragment key={index}>
              {index > 0 && '\n'}
              {status ? (
                <mark
                  className={cn(
                    '-mx-1 rounded-md box-decoration-clone px-1 py-0.5 text-inherit ring-1',
                    highlightClassName[status],
                  )}
                >
                  <PaintedLine line={line} />
                </mark>
              ) : (
                <PaintedLine line={line} />
              )}
            </Fragment>
          )
        })}
        {/* Gives a trailing empty line its height. */}
        {'​'}
      </div>
      <textarea
        aria-label={t('pods.notes.label')}
        className={cn(
          textClassName,
          'm-0 h-full resize-none overflow-hidden border-0 bg-transparent p-0 text-transparent caret-brand-700 outline-none selection:bg-brand-200/60',
        )}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        value={text}
      />
    </div>
  )
}

type ContactLinkProps = {
  label: string
  pulse: boolean
  onOpen: () => void
  onPulseDone: () => void
}

const ContactLink = ({ label, pulse, onOpen, onPulseDone }: ContactLinkProps) => {
  const [lit, setLit] = useState(false)

  useEffect(() => {
    if (!pulse) return
    setLit(true)
    const timer = setTimeout(() => {
      setLit(false)
      onPulseDone()
    }, PULSE_MS)
    return () => clearTimeout(timer)
  }, [pulse, onPulseDone])

  return (
    <div>
      <button
        className={cn(
          '-mx-1 cursor-pointer rounded-md px-1 text-base text-gray-800 leading-6 underline decoration-brand-700 underline-offset-4 outline-none ring-brand-300 focus-visible:ring-3 motion-safe:transition-colors motion-safe:duration-500',
          lit && 'bg-brand-100 ring-1',
        )}
        onClick={onOpen}
        type="button"
      >
        {label}
      </button>
    </div>
  )
}

type TidyNotesAreaProps = {
  blocks: readonly NoteBlock[]
  // The lines to highlight; with none, no Tidy action is shown.
  recognised: readonly RecognisedLine[]
  contactLinkLabel: string
  // Lights the contact link up once, to show where tidied lines went.
  pulseLink: boolean
  onChangeText: (blockId: string, text: string) => void
  onOpenContactLink: () => void
  onTidy: () => void
  onPulseDone: () => void
}

const highlightsOf = (recognised: readonly RecognisedLine[], blockId: string) =>
  new Map(recognised.filter((line) => line.blockId === blockId).map((line) => [line.lineIndex, line.status]))

// Taps on the empty space below the note put the caret at its end.
const focusLastTextarea = (event: MouseEvent<HTMLDivElement>) => {
  if (event.target !== event.currentTarget) return
  const textareas = event.currentTarget.querySelectorAll('textarea')
  const last = textareas[textareas.length - 1]
  if (!last) return
  last.focus()
  last.setSelectionRange(last.value.length, last.value.length)
}

export const TidyNotesArea = ({
  blocks,
  recognised,
  contactLinkLabel,
  pulseLink,
  onChangeText,
  onOpenContactLink,
  onTidy,
  onPulseDone,
}: TidyNotesAreaProps) => {
  const { t } = useTranslation()
  const tidyBlockId = recognised.at(-1)?.blockId

  return (
    <div className="-m-1 flex flex-1 flex-col gap-4">
      {/* Bleeds past the text so a highlight's padding and ring around a line aren't clipped by the scroll box. */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: a pointer convenience; the textareas are focusable themselves */}
      <div
        className="-m-1.5 flex min-h-0 flex-1 cursor-text flex-col overflow-y-auto p-1.5"
        onClick={focusLastTextarea}
      >
        {blocks.map((block) =>
          block.kind === 'contact-link' ? (
            <ContactLink
              key={block.id}
              label={contactLinkLabel}
              onOpen={onOpenContactLink}
              onPulseDone={onPulseDone}
              pulse={pulseLink}
            />
          ) : (
            <Fragment key={block.id}>
              <TextBlock
                highlights={highlightsOf(recognised, block.id)}
                onChange={(text) => onChangeText(block.id, text)}
                text={block.text}
              />
              {block.id === tidyBlockId && (
                <div className="pt-2">
                  <Button onClick={onTidy} size="s" tone="secondary" variant="filled">
                    {t('pods.notes.tidy')}
                  </Button>
                </div>
              )}
            </Fragment>
          ),
        )}
      </div>
      <NotesToolbar />
    </div>
  )
}

const noop = () => {}

type ReadOnlyNotesAreaProps = {
  blocks: readonly NoteBlock[]
  contactLinkLabel: string
  onOpenContactLink: () => void
}

// The same note for someone who may only read it: no caret, no toolbar, no Tidy; links still open.
export const ReadOnlyNotesArea = ({ blocks, contactLinkLabel, onOpenContactLink }: ReadOnlyNotesAreaProps) => {
  const { t } = useTranslation()

  return (
    <section aria-label={t('pods.notes.label')} className="-m-1 flex min-h-0 flex-1 flex-col overflow-y-auto">
      {blocks.map((block) =>
        block.kind === 'contact-link' ? (
          <ContactLink
            key={block.id}
            label={contactLinkLabel}
            onOpen={onOpenContactLink}
            onPulseDone={noop}
            pulse={false}
          />
        ) : (
          <p className={cn(textClassName, 'text-gray-800')} key={block.id}>
            {block.text.split('\n').map((line, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: a line is identified by its position
              <Fragment key={index}>
                {index > 0 && '\n'}
                <PaintedLine line={line} />
              </Fragment>
            ))}
            {/* Gives a trailing empty line its height. */}
            {'​'}
          </p>
        ),
      )}
    </section>
  )
}
