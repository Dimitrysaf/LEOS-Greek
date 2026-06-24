import { GlobalConfig } from '@eui/core';

export const GLOBAL: GlobalConfig = {
  i18n: {
    i18nService: {
      defaultLanguage: 'el',
      languages: ['el', 'en', 'fr'],
    },
    i18nLoader: {
      i18nFolders: ['i18n-eui', 'i18n'],
    },
  },
  user: {
    defaultUserPreferences: {
      dashboard: {},
      lang: 'el',
    },
  },
};
