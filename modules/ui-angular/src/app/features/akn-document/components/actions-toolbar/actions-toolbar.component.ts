import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap, Observable, retry, Subject, take, takeUntil } from 'rxjs';

import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-actions-toolbar',
  templateUrl: './actions-toolbar.component.html',
  styleUrls: ['./actions-toolbar.component.scss'],
})
export class ActionsToolbarComponent implements AfterViewInit, OnDestroy {
  annotationsTooltip$: Observable<string>;
  highlightsTooltip$: Observable<string>;
  guidelinesTooltip$: Observable<string>;
  guidelinesEnabled = true;
  highlightsEnabled = true;

  shouldReloadAfterUpdate = false;
  private destory$ = new Subject<void>();

  constructor(
    public doc: DocumentService,
    private translate: TranslateService,
    private coEditionService: CoEditionServiceWS,
  ) {
    this.annotationsTooltip$ = this.translateByBooleanObservable(
      doc.annotationsEnabled$,
      'page.editor.annotations-button.tooltip-disable',
      'page.editor.annotations-button.tooltip-enable',
    );
    this.highlightsTooltip$ = this.translateByBooleanObservable(
      doc.highlightsEnabled$,
      'page.editor.highlights-button.tooltip-disable',
      'page.editor.highlights-button.tooltip-enable',
    );
    this.guidelinesTooltip$ = this.translateByBooleanObservable(
      doc.guidelinesEnabled$,
      'page.editor.guidelines-button.tooltip-disable',
      'page.editor.guidelines-button.tooltip-enable',
    );
  }
  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  ngAfterViewInit(): void {
    this.coEditionService.shouldReloadAfterUpdate
      .pipe(takeUntil(this.destory$))
      .subscribe((update) => {
        if (update === null) {
          this.shouldReloadAfterUpdate = false;
          return;
        } else {
          const presenterId = this.coEditionService.presenterId;
          if (presenterId !== update.presenterId) {
            this.shouldReloadAfterUpdate = true;
          }
        }
      });
  }

  private translateByBooleanObservable(
    obs: Observable<unknown>,
    truthyKey: string,
    falsyKey: string,
  ) {
    return obs.pipe(
      mergeMap((enabled) => {
        const key = !!enabled ? truthyKey : falsyKey;
        return this.translate.get(key);
      }),
    );
  }
}
