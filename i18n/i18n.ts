import i18n from 'i18next'

import { initReactI18next } from 'react-i18next'
// import LanguageDetector from 'i18next-browser-languagedetector';
import enJSON from './translations/en'
import viJSON from './translations/vi'

// local storage key
// const LOCAL_STORAGE_KEY_LANGUAGE = "hum-language"
// const LANGUAGE_TYPE = Config.languageType?
// get default language
// let DEFAULT_LANGUAGE: string | number | null = LANGUAGE_TYPE.en
// if (typeof window !== "undefined") {
// DEFAULT_LANGUAGE =
// localStorage.getItem(LOCAL_STORAGE_KEY_LANGUAGE) || LANGUAGE_TYPE.en
// }
// const detectLanguage = (languageId) => {
//   for (const key in LANGUAGE_TYPE) {
//     if (languageId.toString() === LANGUAGE_TYPE[key].toString()) {
//       return key.toString()
//     }
//   }
// }

const resources = {
  en: { translation: enJSON },
  vi: { translation: viJSON },
}
i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    keySeparator: '.',
    lng: 'vi',
    fallbackLng: 'en',
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
