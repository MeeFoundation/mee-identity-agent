import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { en } from './en'

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: { en: { translation: en } },
})

export { i18n }
