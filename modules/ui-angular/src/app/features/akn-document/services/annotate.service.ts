import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

import {
  AnnotateDocumentConfig,
  AnnotateDocumentState,
  AnnotateExtension,
  AnnotateGlobalConfig,
  AnnotateLocalConfig,
  AnnotateLocalState,
} from '@/features/akn-document/models';
import { AnnotateConnector } from '@/features/akn-document/services/annotate-connector';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';

@Injectable()
export class AnnotateService implements OnDestroy {
  private documentIdSubj = new BehaviorSubject<string | null>(null);
  private connector?: AnnotateConnector;
  private destroy$ = new Subject<void>();

  constructor(private leos: LeosLegacyService) {
    const documentId$ = this.documentIdSubj.pipe(filter(Boolean));
    const documentState$ = documentId$.pipe(
      mergeMap((id) => this.fetchDocumentState(id)),
    );
    const globalConfig$ = this.getGlobalConfig();
    const state$ = combineLatest([globalConfig$, documentState$]).pipe(
      map(([globalC, documentS]) => ({
        ...leosJavaScriptExtensionState,
        ...globalC,
        ...documentConfig,
        ...documentS,
        ...localConfig,
        ...localState,
      })),
    );
    const connector$ = state$.pipe(
      tap(() => this.connector?.destroy()),
      map((state) => new AnnotateConnector(state)),
      tap((connector) => (this.connector = connector)),
    );
    const annotateExtension$ = this.leos.require$.pipe(
      mergeMap(
        (require) =>
          new Observable<AnnotateExtension>((subscriber) => {
            require(['extension/annotateExtension'], (annotate) => {
              subscriber.next(annotate);
            });
          }),
      ),
    );
    combineLatest([annotateExtension$, connector$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([annotate, connector]) => {
        annotate.init(connector); // FIXME: possible multiple initializations?
        // trigger sidebar refresh - see annotateExtension.js -> _connectorStateChangeListener()
        connector.getState().dirtyTimestamp += 1;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.connector?.destroy();
  }

  setDocumentId(documentId: string) {
    this.documentIdSubj.next(documentId);
  }

  private getGlobalConfig() {
    // TODO: fetch from server API - eg `/api/secured/config/annotate`
    return of(globalConfig);
  }

  private fetchDocumentState(documentId: string) {
    // TODO: fetch from server API - eg `/api/secured/documents/:id/annotate`
    return of(documentState);
  }
}

const leosJavaScriptExtensionState: LeosJavaScriptExtensionState = {
  callbackNames: [
    'requestDocumentMetadata',
    'requestUserPermissions',
    'requestMergeSuggestion',
    'requestMergeSuggestions',
    'requestSearchMetadata',
    'requestSecurityToken',
    'responseFilteredAnnotations',
  ],
  rpcInterfaces: {
    'eu.europa.ec.leos.ui.shared.js.LeosJavaScriptServerRpc': [
      'clientJSDepsInited',
    ],
  },
  jsDepsInited: true,
  dirtyTimestamp: -1,
};

const globalConfig: AnnotateGlobalConfig = {
  authority: 'LEOS', // TODO: get from globalConfig["annotate.authority"]
  // anotClient: `${document.baseURI}annotate/client`, // TODO: get from globalConfig["annotate.client.url"]
  // anotHost: `${document.baseURI}annotate`, // TODO: get from globalConfig["annotate.server.url"]
  anotClient: `http://localhost:9099/annotate/client`, // TODO: get from globalConfig["annotate.client.url"]
  anotHost: `http://localhost:9099/annotate`, // TODO: get from globalConfig["annotate.server.url"]
  oauthClientId: 'AnnotateIssuedClientId', // TODO: get from globalConfig["annotate.jwt.issuer.client.id"];
  annotationPopupDefaultStatus: 'ON', // TODO: get from globalConfig["annotate.popup.default.status"]
  isSpellCheckerEnabled: false, // TODO: get from globalConfig["leos.spell.checker.enabled"]
  spellCheckerServiceUrl: '', // TODO: get from globalConfig["leos.spell.checker.service.url"]
  spellCheckerSourceUrl: '', // TODO: get from globalConfig["leos.spell.checker.source.url"]
  sidebarAppId: null,
  // temporaryDataId: 'xxx',
  // temporaryDataDocument: 'xxx',
};

const documentConfig: AnnotateDocumentConfig = {
  //
};

const documentState: AnnotateDocumentState = {
  operationMode: 'NORMAL', // TODO: CLIENT (calc from permissions) OR SERVER (get from operationMode.name())
  proposalRef: 'proposal', // TODO: CLIENT get from editor page -> getDocument() API response
};

const localConfig: AnnotateLocalConfig = {
  connectedEntity: 'DGT.R.3', // TODO: CLIENT get from UserService -> getCurrentUser() API response
  annotationContainer: '#docContainer', // TODO: CLIENT set depending on component placement (editor vs MilestoneExplorer)
};

const localState: AnnotateLocalState = {
  showStatusFilter: false,
  showGuideLinesButton: true,
};
