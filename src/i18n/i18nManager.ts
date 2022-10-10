import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enResources from './en/resources.json';
import esResources from './es/resources.json';

const i18nManager = {
  initialize() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: 'en',
        resources: {
          en: enResources,
          es: esResources,
        },
        ns: ['common'],
        defaultNS: 'common',
        interpolation: {
          escapeValue: false,
        },
        debug: process.env.NODE_ENV !== 'production',
      });
  },

  addResources(language: string, namespace: string, resources: Record<string, string>) {
    i18n.addResources(language, namespace, resources);
  },
};

export default i18nManager;
