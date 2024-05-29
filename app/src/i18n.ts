import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['FI', 'SE', 'EN'],
    fallbackLng: 'FI',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      // React public folder
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to your translation files
    },
  })

export default i18n
