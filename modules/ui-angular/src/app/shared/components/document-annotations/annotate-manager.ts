import {
  combineLatest,
  map,
  mergeMap,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';
import {
  AnnotateConnectorState,
  AnnotateExtension,
  AnnotateOperationMode,
  Permission,
} from '@/shared/models';
import { AnnotateService } from '@/shared/services/annotate.service';
import { DocumentService } from '@/shared/services/document.service';

import { AnnotateConnector } from './annotate-connector';

export type AnnotateConnectorOptions = Pick<
  AnnotateConnectorState,
  | 'operationMode'
  | 'sidebarContainer'
  | 'annotationContainer'
  | 'proposalRef'
  | 'legFileName'
  | 'showStatusFilter'
  | 'showGuideLinesButton'
  | 'disableSuggestionButton'
  | 'disableHighlightButton'
  | 'connectedEntity'
  | 'sidebarAppId'
  | 'temporaryDataId'
  | 'temporaryDataDocument'
>;

export class AnnotateManager {
  private connector?: AnnotateConnector;
  private destroy$ = new Subject<void>();
  private annotationsCb = new Set<(annotations: string) => void>();

  constructor(
    private leos: LeosLegacyService,
    private appConfig: AppConfigService,
    private permissions: Permission[],
    private options: AnnotateConnectorOptions,
    private annotateService: AnnotateService,
    private documentService: DocumentService,
    private ckEditorService?: CKEditorService,
  ) {
    this.ckEditorService?.openState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.connector?.stateChangeHandler?.(state);
      });
    const responseFilteredAnnotations = (annotations: string) => {
      this.annotationsCb.forEach((cb) => cb(annotations));
      this.annotationsCb.clear();
    };
    const connector$ = this.createConnectorState().pipe(
      tap(() => this.connector?.destroy()),
      map(
        (state) =>
          new AnnotateConnector(
            state,
            {
              permissions,
              responseFilteredAnnotations,
            },
            annotateService,
            this.documentService,
          ),
      ),
      tap((connector) => (this.connector = connector)),
    );
    const annotateExtension$ = leos.require$.pipe(
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
        annotate.init(connector);
        // trigger sidebar refresh - see annotateExtension.js -> _connectorStateChangeListener()
        connector.jsDepsInited();
      });
  }

  destroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.connector?.destroy();
  }

  async getAnnotations(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.connector) {
        this.annotationsCb.add(resolve);
        this.connector.requestFilteredAnnotations();
      } else {
        reject(new Error('Connector not initialized yet'));
      }
    });
  }

  /** Refreshes the sidebar content, the document highlights and the lines. */
  refresh() {
    if (this.connector) {
      this.connector.$triggerStateChange();
    }
  }

  /** Sets the annotations mode. */
  setAnnotationMode(mode: AnnotateOperationMode) {
    if (this.connector) {
      this.connector.getState().operationMode = mode as AnnotateOperationMode;
    }
  }

  private createConnectorState() {
    return this.appConfig.config.pipe(
      map(
        (config) =>
          ({
            isAngularUI: true,
            authority: config.annotateAuthority,
            anotClient: config.annotateClientUrl,
            anotHost: config.annotateHostUrl,
            oauthClientId: config.annotateJwtIssuerClientId,
            annotationPopupDefaultStatus: config.annotatePopupDefaultStatus,
            isSpellCheckerEnabled: config.spellCheckerEnabled,
            spellCheckerServiceUrl: config.spellCheckerServiceUrl ?? '',
            spellCheckerSourceUrl: config.spellCheckerSourceUrl ?? '',
            ...this.options,
          } as AnnotateConnectorState),
      ),
    );
  }
}
