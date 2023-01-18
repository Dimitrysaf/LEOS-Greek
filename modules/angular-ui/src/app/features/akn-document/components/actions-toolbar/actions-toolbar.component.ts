import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap, Observable } from 'rxjs';

import { DocumentService } from '@/features/akn-document/services/document.service';

@Component({
  selector: 'app-actions-toolbar',
  templateUrl: './actions-toolbar.component.html',
  styleUrls: ['./actions-toolbar.component.scss'],
})
export class ActionsToolbarComponent {
  annotationsTooltip$: Observable<string>;
  highlightsTooltip$: Observable<string>;
  guidelinesTooltip$: Observable<string>;
  guidelinesEnabled = true;
  highlightsEnabled = true;

  constructor(
    public doc: DocumentService,
    private translate: TranslateService,
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
