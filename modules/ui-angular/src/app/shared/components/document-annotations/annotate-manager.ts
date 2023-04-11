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
import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';
import {
  AnnotateConnectorState,
  AnnotateExtension,
  Permission,
} from '@/shared/models';
import { AnnotateService } from '@/shared/services/annotate.service';

import { AnnotateConnector } from './annotate-connector';

export type AnnotateConnectorOptions = Pick<
  AnnotateConnectorState,
  | 'operationMode'
  | 'annotationContainer'
  | 'proposalRef'
  | 'showStatusFilter'
  | 'showGuideLinesButton'
  | 'connectedEntity'
>;

export class AnnotateManager {
  private connector?: AnnotateConnector;
  private destroy$ = new Subject<void>();
  private annotationsCb = new Set<(annotations: string) => void>();

  constructor(
    private leos: LeosLegacyService,
    private appConfig: AppConfigService,
    private documentId: string,
    permissions: Permission[],
    private options: AnnotateConnectorOptions,
    private annotateService: AnnotateService,
  ) {
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
        annotate.init(connector); // FIXME: possible multiple initializations?
        // trigger sidebar refresh - see annotateExtension.js -> _connectorStateChangeListener()
        connector.getState().dirtyTimestamp += 1;
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
      this.connector.getState().dirtyTimestamp += 1;
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
            spellCheckerServiceUrl: config.spellCheckerServiceUrl,
            spellCheckerSourceUrl: config.spellCheckerSourceUrl,
            sidebarAppId: null, // TODO
            // temporaryDataId: 'xxx', // TODO
            // temporaryDataDocument: 'xxx', // TODO
            ...this.options,
          } as AnnotateConnectorState),
      ),
    );
  }
}
