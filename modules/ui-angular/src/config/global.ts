import { GlobalConfig } from '@eui/core';

import { RoleEntry } from '@/shared';

type LeosConfig = {
  instance: 'os' | 'ec' | 'cn';
  env: string;
  roles: RoleEntry[];
};

const getLeosConfig = () => {
  const configStr =
    document.head.querySelector(`script#leos-config`).textContent;
  return JSON.parse(configStr) as LeosConfig;
};

export const GLOBAL: GlobalConfig = {
  appTitle: 'CSDR-app',
  i18n: {
    i18nService: {
      defaultLanguage: 'en',
      languages: ['en', 'fr'],
    },
    i18nLoader: {
      i18nFolders: ['i18n-eui', 'i18n', 'i18n-ecl'],
    },
  },
  user: {
    defaultUserPreferences: {
      dashboard: {},
      lang: 'en',
    },
  },
  leos: getLeosConfig(),
};
