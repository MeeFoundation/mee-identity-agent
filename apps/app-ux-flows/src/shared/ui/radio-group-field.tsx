import { useId } from 'react'

import { Label } from './primitives/label'
import { Radio, RadioGroup } from './primitives/radio'

type RadioOption<T extends string> = {
  value: T
  label: string
}

type RadioGroupFieldProps<T extends string> = {
  label: string
  value: NoInfer<T>
  options: readonly RadioOption<T>[]
  onChange: (value: T) => void
}

export const RadioGroupField = <T extends string>({ label, value, options, onChange }: RadioGroupFieldProps<T>) => {
  const labelId = useId()

  return (
    <div className="flex flex-col gap-2">
      <span className="px-0.5 text-base text-gray-800" id={labelId}>
        {label}
      </span>
      <RadioGroup<T> aria-labelledby={labelId} onValueChange={onChange} value={value}>
        {options.map((option) => (
          <Label
            className="flex cursor-pointer items-center gap-3 rounded-xl px-1 py-2.5 text-base text-gray-800 hover:bg-gray-50"
            key={option.value}
          >
            <Radio value={option.value} />
            {option.label}
          </Label>
        ))}
      </RadioGroup>
    </div>
  )
}
