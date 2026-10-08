type SectionLabelProps = {
  children: string
}

export const SectionLabel = ({ children }: SectionLabelProps) => (
  <h2 className="pt-2 font-semibold text-gray-600 text-xs uppercase">{children}</h2>
)
