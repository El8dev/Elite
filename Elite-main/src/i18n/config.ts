import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

// Force getting language from local storage, default to 'ar'
const savedLanguage = localStorage.getItem('i18nextLng') || 'ar';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    lng: savedLanguage,
    supportedLngs: ['ar', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

// Handle RTL/LTR document direction dynamically
i18n.on('languageChanged', (lng) => {
  const shortLng = lng.startsWith('ar') ? 'ar' : 'en';
  document.documentElement.dir = shortLng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = shortLng;
  localStorage.setItem('i18nextLng', shortLng);
});

// Run once on load to set initial document direction
const initialLng = savedLanguage.startsWith('ar') ? 'ar' : 'en';
document.documentElement.dir = initialLng === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = initialLng;

export default i18n;
