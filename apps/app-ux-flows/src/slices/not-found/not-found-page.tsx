import { useTranslation } from 'react-i18next'

export const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <main>
      <section>
        <h1>{t('notFound.title')}</h1>
        <a href="/">{t('notFound.backHome')}</a>
      </section>
    </main>
  )
}
