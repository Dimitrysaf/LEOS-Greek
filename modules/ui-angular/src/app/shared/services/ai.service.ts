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
import {AnalysisResults, AnalysisStatus} from "@/shared/models/leos.ai.model";

@Injectable({ providedIn: 'root' })
export class AIService implements OnDestroy {
  public analysisResult$ : Observable<AnalysisResults>;
  public analysisStatus$ : Observable<AnalysisStatus>;

  private destroy$ = new Subject<void>();
  private analysisResultsBS = new BehaviorSubject<AnalysisResults>(null);
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
      .subscribe((val) => {
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
        analysisType ? `${apiBaseUrl}/secured/ai/${proposalRef}?analysisType=${analysisType}` : `${apiBaseUrl}/secured/ai/${proposalRef}`,
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
