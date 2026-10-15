import { cn } from '@/shared/lib/cn'

type CountBadgeProps = {
  count: number
  tone?: 'brand' | 'gray'
}

export const CountBadge = ({ count, tone = 'brand' }: CountBadgeProps) => (
  <span
    className={cn(
      'flex h-5 min-w-5 items-center justify-center rounded-full border px-1.5 font-semibold text-xs',
      tone === 'brand' ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-gray-200 bg-gray-50 text-gray-700',
    )}
  >
    {count}
  </span>
)
