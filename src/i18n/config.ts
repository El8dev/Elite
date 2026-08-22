import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    supportedLngs: ['ar', 'en'],
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

// Synchronize document direction (RTL / LTR) immediately
const syncDocumentDirection = (lng: string) => {
  if (typeof document !== 'undefined') {
    const isAr = lng.startsWith('ar');
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = isAr ? 'ar' : 'en';
  }
};

// Initial sync on module load
syncDocumentDirection(i18n.language || 'ar');

// Handle RTL/LTR document direction dynamically on language switch
i18n.on('languageChanged', (lng) => {
  syncDocumentDirection(lng);
});

export default i18n;
