import type { Icon } from 'react-bootstrap-icons'

type CategoryCellProps = {
  icon: Icon
  label: string
}

// A row a template adds to a pod — a form or a suggested subpod — shown as information, not as a control.
export const CategoryCell = ({ icon: CellIcon, label }: CategoryCellProps) => (
  <div className="flex w-full items-center gap-2 rounded-2xl bg-white py-2 pr-4 pl-2 shadow-card">
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
      <CellIcon aria-hidden className="text-brand-500" size={18} />
    </span>
    <span className="min-w-0 flex-1 font-medium text-base text-gray-900">{label}</span>
  </div>
)
