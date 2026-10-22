import { useTranslation } from 'react-i18next'

import type { ComponentEnvironment } from '../runtime/define-flow'
import type { ResolvedFlow, ResolvedNote } from '../runtime/resolve-flow'
import { Button } from '@/shared/ui/button'

export type BriefingFlow = Pick<
  ResolvedFlow<string, ComponentEnvironment, object>,
  'titleKey' | 'caseId' | 'caseCode' | 'caseNameKey' | 'cases' | 'goalKey' | 'hints' | 'notes'
>

type BriefingRun = {
  completed: boolean
  restart: () => void
}

export type BriefingProps = {
  flow: BriefingFlow
  screenId: string
  // `null` until the runner has reported its first run.
  run: BriefingRun | null
  onTryCase: (caseId: string) => void
}

export const CaseLabel = ({ flow }: { flow: BriefingFlow }) => {
  const { t } = useTranslation()
  if (!flow.caseCode) return null

  return (
    <p className="flex flex-col gap-0.5">
      <span className="font-mono text-gray-500 text-xs">{flow.caseCode}</span>
      {flow.caseNameKey && <span className="font-medium text-gray-900">{t(flow.caseNameKey)}</span>}
    </p>
  )
}

const BriefingSection = ({ title, children }: { title: string; children: string }) => (
  <section className="flex flex-col gap-1">
    <h2 className="font-semibold text-gray-500 text-xs uppercase tracking-wide">{title}</h2>
    <p className="text-gray-900">{children}</p>
  </section>
)

const NotesGroup = ({ title, note }: { title: string; note: ResolvedNote | null | undefined }) => {
  const { t } = useTranslation()
  if (!note || (!note.aboutKey && note.questionKeys.length === 0)) return null

  return (
    <section className="flex flex-col gap-2 border-gray-200 border-t pt-4">
      <h2 className="font-semibold text-gray-500 text-xs uppercase tracking-wide">{title}</h2>
      {note.aboutKey && <p className="text-gray-900">{t(note.aboutKey)}</p>}
      {note.questionKeys.length > 0 && (
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-gray-700">{t('flow.briefing.openQuestions')}</h3>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-gray-900">
            {note.questionKeys.map((questionKey) => (
              <li key={questionKey}>{t(questionKey)}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

// What the side panel and the phone-width overlay both show.
export const BriefingContent = ({ flow, screenId, run, onTryCase }: BriefingProps) => {
  const { t } = useTranslation()
  const completed = run?.completed ?? false
  const hintKey = flow.hints[screenId]

  return (
    <div className="flex flex-col gap-4 text-sm">
      <CaseLabel flow={flow} />
      {flow.goalKey && (
        <section className="flex flex-col gap-1 rounded-xl border border-brand-200 bg-brand-50 p-3">
          <h2 className="font-semibold text-brand-700 text-xs uppercase tracking-wide">
            {t('flow.briefing.yourGoal')}
          </h2>
          <p className="font-medium text-base text-gray-900">{t(flow.goalKey)}</p>
        </section>
      )}
      {completed ? (
        <output className="flex flex-col gap-1 rounded-xl bg-success-50 p-3">
          <h2 className="font-semibold text-success-700">{t('flow.briefing.goalReached')}</h2>
          <p className="text-gray-900">
            {flow.cases.length > 0 ? t('flow.briefing.reachedCase') : t('flow.briefing.reachedFlow')}
          </p>
        </output>
      ) : (
        hintKey && <BriefingSection title={t('flow.briefing.onThisScreen')}>{t(hintKey)}</BriefingSection>
      )}
      <div className="flex flex-col items-start gap-2">
        <Button disabled={!run} onClick={() => run?.restart()} size="s" tone="tertiary" variant="outlined">
          {t('flow.briefing.startOver')}
        </Button>
        {completed &&
          flow.cases
            .filter((choice) => choice.id !== flow.caseId)
            .map((choice) => (
              <Button key={choice.id} onClick={() => onTryCase(choice.id)} size="s" variant="link">
                {t('flow.briefing.tryCase', { code: choice.code })}
              </Button>
            ))}
      </div>
      <NotesGroup note={flow.notes.screens[screenId]} title={t('flow.briefing.thisScreen')} />
      <NotesGroup note={flow.notes.case} title={t('flow.briefing.thisCase')} />
      <NotesGroup note={flow.notes.flow} title={t('flow.briefing.thisFlow')} />
    </div>
  )
}
