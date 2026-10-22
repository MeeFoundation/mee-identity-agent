import { ChevronDown } from 'react-bootstrap-icons'

import {
  Select,
  SelectIcon,
  SelectItem,
  SelectItemText,
  SelectLabel,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from './primitives/select'
import { useOverlayContainer } from '@/shared/lib/overlay-container'

type SelectOption<T extends string> = {
  value: T
  label: string
  disabled?: boolean
}

type SelectFieldProps<T extends string> = {
  label: string
  value: NoInfer<T>
  options: readonly SelectOption<T>[]
  onChange: (value: T) => void
}

export const SelectField = <T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) => {
  const container = useOverlayContainer()

  return (
    <Select
      items={options}
      onValueChange={(next: T | null) => {
        if (next !== null) onChange(next)
      }}
      value={value}
    >
      <div className="group flex flex-col gap-2">
        <SelectLabel className="px-0.5 text-base text-gray-800 group-focus-within:text-brand-700">{label}</SelectLabel>
        <SelectTrigger className="h-11 p-3 text-base">
          <SelectValue className="min-w-0 flex-1 truncate" />
          <SelectIcon>
            <ChevronDown aria-hidden className="text-gray-700" size={20} />
          </SelectIcon>
        </SelectTrigger>
      </div>
      <SelectPortal container={container}>
        <SelectPositioner alignItemWithTrigger={false} sideOffset={4}>
          <SelectPopup>
            {options.map((option) => (
              <SelectItem disabled={option.disabled} key={option.value} value={option.value}>
                <SelectItemText>{option.label}</SelectItemText>
              </SelectItem>
            ))}
          </SelectPopup>
        </SelectPositioner>
      </SelectPortal>
    </Select>
  )
}
