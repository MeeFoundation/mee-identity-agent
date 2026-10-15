import { ChevronRightIcon } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'

import type { ScreenHref } from './flow-catalogue'
import { familyTitleKeys } from './flow-families'
import { type FlowLauncher, FlowRow, type FlowStartChoice } from './flow-row'
import { HiddenBadge } from './hidden-badge'

type FlowGroupProps = {
  family: string
  flows: readonly FlowLauncher[]
  expanded: boolean
  onToggle: () => void
  showCodes: boolean
  onStartFlow: (flowId: string, choice?: FlowStartChoice) => void
  screenHref: ScreenHref
  onOpenScreen: (href: string) => void
}

export const FlowGroup = ({
  family,
  flows,
  expanded,
  onToggle,
  showCodes,
  onStartFlow,
  screenHref,
  onOpenScreen,
}: FlowGroupProps) => {
  const { t } = useTranslation()
  const contentId = useId()
  const titleKey = familyTitleKeys[family]

  return (
    <li className="flex flex-col">
      <button
        aria-controls={contentId}
        aria-expanded={expanded}
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left outline-none hover:bg-gray-50 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
        onClick={onToggle}
        type="button"
      >
        <ChevronRightIcon
          aria-hidden
          className={`size-4 shrink-0 text-gray-500 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
        {showCodes && (
          <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 font-medium font-mono text-gray-600 text-xs">
            {family}
          </span>
        )}
        <span className="font-semibold text-base text-gray-900">
          {t('home.group.title', { count: flows.length, title: titleKey ? t(titleKey) : family })}
        </span>
        {flows.every((flow) => flow.hidden) && <HiddenBadge />}
      </button>
      {expanded && (
        <ul className="divide-y divide-gray-200 border-gray-200 border-t bg-gray-50/50 pl-6" id={contentId}>
          {flows.map((flow) => (
            <FlowRow
              flow={flow}
              key={flow.id}
              onOpenScreen={onOpenScreen}
              onStartFlow={onStartFlow}
              screenHref={screenHref}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
