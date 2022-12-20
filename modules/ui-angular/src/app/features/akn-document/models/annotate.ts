import type { AnnotateConnector } from '@/features/akn-document/services/annotate-connector';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';

export type AnnotateExtension = {
  init(connector: AnnotateConnector);
};

/* Set on server start (instance + env + dependent) */
export type AnnotateGlobalConfig = {
  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  authority: string;
  anotClient: string;
  anotHost: string;
  oauthClientId: string;
  annotationPopupDefaultStatus: 'ON' | 'OFF';
  isSpellCheckerEnabled: boolean;
  spellCheckerServiceUrl: string;
  spellCheckerSourceUrl: string;
  // these 3 are used only in Proposal* documents (EC?)
  sidebarAppId?: string | null;
  temporaryDataId?: string;
  temporaryDataDocument?: string;
};

/* Set on server start (instance + env + document type dependent) */
export type AnnotateDocumentConfig = {
  //
};

/* Calculated on the server (instance + env + document + user dependent) */
export type AnnotateDocumentState = {
  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  operationMode: AnnotateOperationMode;
  proposalRef: string;
};

/* Client-side config */
export type AnnotateLocalConfig = {
  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  connectedEntity: string;
  /* CSS selector */
  annotationContainer: string;
};

/* Client-side only state */
export type AnnotateLocalState = {
  /* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
  showStatusFilter: boolean;
  showGuideLinesButton: boolean;
};

export type AnnotateConnectorState = LeosJavaScriptExtensionState &
  AnnotateGlobalConfig &
  AnnotateDocumentConfig &
  AnnotateDocumentState &
  AnnotateLocalConfig &
  AnnotateLocalState;

export type AnnotateOperationMode = 'READ_ONLY' | 'PRIVATE' | 'NORMAL';

export type MergeSuggestion = {
  origText: string;
  elementId: string;
  startOffset: string;
  endOffset: number;
  newText: number;
};

export type AnnotateMetadata = {
  id: string;
  title: string;
  version: string;
};
