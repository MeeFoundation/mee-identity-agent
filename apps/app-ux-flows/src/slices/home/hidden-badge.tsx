import { useTranslation } from 'react-i18next'

// Marks a flow, variant or case that production builds leave out; production never renders one.
export const HiddenBadge = () => {
  const { t } = useTranslation()

  return (
    <span className="shrink-0 rounded-md bg-warning-50 px-1.5 py-0.5 font-medium text-warning-800 text-xs">
      {t('home.hiddenInProduction')}
    </span>
  )
}
