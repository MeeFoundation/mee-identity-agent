type CountBadgeProps = {
  count: number
}

export const CountBadge = ({ count }: CountBadgeProps) => (
  <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-brand-200 bg-brand-50 px-1.5 font-semibold text-brand-700 text-xs">
    {count}
  </span>
)
