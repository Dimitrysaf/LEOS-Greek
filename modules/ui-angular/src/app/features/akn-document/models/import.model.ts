import type { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';

import type { ImportConnector } from '../components/import-from-journal-dialog/import-connector';

export type DocType = 'REGULATION' | 'DIRECTIVE' | 'DECISION';

export type ElementName = 'recital' | 'article';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ImportConnectorState = LeosJavaScriptExtensionState & {};

export type ImportExtension = {
  init(connector: ImportConnector);
};
