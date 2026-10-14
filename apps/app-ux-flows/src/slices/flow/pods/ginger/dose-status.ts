import type { MedicationDose } from './model'

export type DoseStatus = 'upcoming' | 'due' | 'overdue' | 'given'

const DEFAULT_DUE_WINDOW_MINUTES = 60

// A dose is due from `dueWindowMinutes` before its scheduled time until as long after it.
export const toDoseStatus = (
  dose: MedicationDose,
  now: Date,
  { dueWindowMinutes = DEFAULT_DUE_WINDOW_MINUTES }: { dueWindowMinutes?: number } = {},
): DoseStatus => {
  if (dose.status === 'given') return 'given'
  const offsetMs = now.getTime() - new Date(dose.scheduledAt).getTime()
  const windowMs = dueWindowMinutes * 60_000
  if (offsetMs < -windowMs) return 'upcoming'
  if (offsetMs > windowMs) return 'overdue'
  return 'due'
}

export const formatDoseTime = (iso: string, language: string) =>
  new Intl.DateTimeFormat(language, { timeStyle: 'short' }).format(new Date(iso))
