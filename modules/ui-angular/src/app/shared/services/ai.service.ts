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
import {
  AnalysisResults,
  AnalysisStatus
} from "@/shared/models/leos.ai.model";
import {DocumentViewResponse} from "@/shared/models/document-view-response.model";

@Injectable({ providedIn: 'root' })
export class AIService implements OnDestroy {
  public analysisResult$ : Observable<DocumentViewResponse>;
  public analysisStatus$ : Observable<AnalysisStatus>;

  private destroy$ = new Subject<void>();
  private analysisResultsBS = new BehaviorSubject<DocumentViewResponse>(null);
  private analysisStatusBS = new BehaviorSubject<AnalysisStatus>(null);

  constructor(
    private http: HttpClient,
    private growlService: EuiGrowlService,
    private translateService: TranslateService,
  ) {
    this.analysisResult$ = this.analysisResultsBS.asObservable();
    this.analysisStatus$ = this.analysisStatusBS.asObservable();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  prepareAnalysis(proposalRef: string) {
    if (!proposalRef) {
      return;
    }
    this.http
      .put<any>(
        `${apiBaseUrl}/secured/ai/${proposalRef}`,
        {},
        {},
      )
      .subscribe({
        next: (val) => {
          this.growlService.growl({
            severity: 'success',
            summary: this.translateService.instant(
              'page.editor.ai.prefill.digital.dimensions.lfds.start.success',
            ),
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
        error: (err) => {
          this.growlService.growl({
            severity: 'danger',
            summary: this.translateService.instant(
              'page.editor.ai.prefill.digital.dimensions.lfds.start.error',
            ),
            detail: err,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        }
      });
  }

  getAnalysisStatus(proposalRef: string) {
    if (!proposalRef) {
      return;
    }
    this.http
      .get<any>(
        `${apiBaseUrl}/secured/ai/status/${proposalRef}`,
        {},
      )
      .subscribe({
        next: (res: AnalysisStatus) => this.analysisStatusBS.next(res),
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

  prefillDigitalDimensionsLFDS(proposalRef: string, analysisType: string = null) {
    if (!proposalRef) {
      return;
    }
    this.http
      .get<any>(
        analysisType ? `${apiBaseUrl}/secured/stat_digit_financ_legis/ai/${proposalRef}?analysisType=${analysisType}` : `${apiBaseUrl}/secured/stat_digit_financ_legis/ai/${proposalRef}`,
        {},
      )
      .subscribe({
        next: (res: DocumentViewResponse) => this.analysisResultsBS.next(res),
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
