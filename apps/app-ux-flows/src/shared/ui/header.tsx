import { useTranslation } from 'react-i18next'

type HeaderProps = {
  title: string
  onBack?: () => void
}

export const Header = ({ title, onBack }: HeaderProps) => {
  const { t } = useTranslation()

  return (
    <header>
      {onBack && (
        <button onClick={onBack} type="button">
          {t('ui.header.back')}
        </button>
      )}
      <h1>{title}</h1>
    </header>
  )
}
