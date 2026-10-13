import { Checkbox as CheckboxPrimitive } from './primitives/checkbox'
import { Label } from './primitives/label'

type CheckboxProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const Checkbox = ({ label, checked, onChange }: CheckboxProps) => (
  <Label className="flex w-fit items-center gap-2">
    <CheckboxPrimitive checked={checked} onCheckedChange={(next) => onChange(next)} />
    {label}
  </Label>
)
