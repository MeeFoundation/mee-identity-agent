import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/button'

import type { ComponentEnvironment } from '../runtime/define-flow'
import type { ResolvedFlow } from '../runtime/resolve-flow'

export type BriefingFlow = Pick<
  ResolvedFlow<string, ComponentEnvironment, object>,
  'titleKey' | 'caseId' | 'caseCode' | 'caseNameKey' | 'cases' | 'goalKey' | 'hints'
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

// What the side panel and the phone-width overlay both show.
export const BriefingContent = ({ flow, screenId, run, onTryCase }: BriefingProps) => {
  const { t } = useTranslation()
  const completed = run?.completed ?? false
  const hintKey = flow.hints[screenId]

  return (
    <div className="flex flex-col gap-4 text-sm">
      <CaseLabel flow={flow} />
      {flow.goalKey && <BriefingSection title={t('flow.briefing.yourGoal')}>{t(flow.goalKey)}</BriefingSection>}
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
    </div>
  )
}
