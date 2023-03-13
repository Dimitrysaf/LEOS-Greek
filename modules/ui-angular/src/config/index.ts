import { EuiAppConfig } from '@eui/core';

import { GLOBAL } from './global';
import { MODULES } from './modules';

export const apiBaseUrl = document.baseURI.replace(/[^/]+\/$/, 'api');

export const appConfig: EuiAppConfig = {
  global: GLOBAL,
  modules: MODULES,
};
