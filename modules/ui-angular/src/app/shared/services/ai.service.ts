import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { EuiGrowlService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
} from 'rxjs';
import { apiBaseUrl } from 'src/config';
import {AnalysisResults} from "@/shared/models/leos.ai.model";

@Injectable({ providedIn: 'root' })
export class AIService implements OnDestroy {
  public analysisResult$ : Observable<AnalysisResults>;

  private destroy$ = new Subject<void>();
  private analysisResultsBS = new BehaviorSubject<AnalysisResults>(null);

  constructor(
    private http: HttpClient,
    private growlService: EuiGrowlService,
    private translateService: TranslateService,
  ) {
    this.analysisResult$ = this.analysisResultsBS.asObservable();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  prepareAnalysis(proposalRef: string) {
    this.http
      .put<any>(
        `${apiBaseUrl}/secured/ai/${proposalRef}`,
        {},
        {},
      )
      .subscribe((val) => {
      });
  }

  prefillDigitalDimensionsLFDS(proposalRef: string) {
    this.http
      .get<any>(
        `${apiBaseUrl}/secured/ai/${proposalRef}`,
        {},
      )
      .subscribe({
        next: (res: AnalysisResults) => this.analysisResultsBS.next(res),
        error: (res) => {
          this.growlService.growl({
            severity: 'danger',
            summary: this.translateService.instant(
              'page.editor.ai.prefill.digital.dimensions.lfds.error',
            ),
            detail: res,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
      });
  }
}
