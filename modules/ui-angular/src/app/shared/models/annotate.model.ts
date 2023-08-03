import type { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import type { AnnotateConnector } from '@/shared/components/document-annotations/annotate-connector';

export type AnnotateExtension = {
  init(connector: AnnotateConnector): void;
};

export type AnnotateOperationMode = 'READ_ONLY' | 'PRIVATE' | 'NORMAL';

/* defined in `modules/ui/src/main/java/eu/europa/ec/leos/ui/extension/AnnotateExtension.java` */
export type AnnotateConnectorState = LeosJavaScriptExtensionState & {
  isAngularUI: boolean;

  // Set on server start (instance + env + dependent)
  authority: string;
  anotClient: string;
  anotHost: string;
  oauthClientId: string;
  annotationPopupDefaultStatus: 'ON' | 'OFF';
  isSpellCheckerEnabled: boolean;
  spellCheckerServiceUrl: string;
  spellCheckerSourceUrl: string;

  // these 3 are used only in revision sidebar (contribution view)
  sidebarAppId?: string; // always 'revision-01'
  temporaryDataId?: string;
  temporaryDataDocument?: string; // documentRef of "contributed document"

  // Component context options
  operationMode: AnnotateOperationMode;
  /* CSS selector */
  annotationContainer: string;

  // Calculated on the server (instance + env + document + user dependent)
  proposalRef?: string;

  // Client-side only state
  showStatusFilter: boolean;
  showGuideLinesButton: boolean;

  // App session depended properties
  connectedEntity?: string;
};

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
  status: string[];
};

export type MergeSuggestionRequest = {
  completeOuterHTML: string;
  elementId: string;
  newText: string;
  origText: string;
  parentElementId: string;
  endOffset: number;
  startOffset: number;
};

export type MergeSuggestionResponse = {
  elementId: string;
  newText: string;
  origText: string;
  parentElementId: string;
  endOffset: number;
  startOffset: number;
  result: string;
};
