import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EuiGrowlService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import {
  PageMode,
  PageModeService,
} from '@/features/akn-document/services/page-mode.service';
import { DocumentViewResponse } from '@/shared/models/document-view-response.model';
import { VersionInfoVO } from '@/shared/models/version-info.model';
import { DocumentService } from '@/shared/services/document.service';
import { ZoombarService } from '@/shared/services/zoombar.service';

import { apiBaseUrl } from '../../../../config';
import { SyncDocumentScrollService } from './sync-document-scroll.service';
import { ExceptionResponseVO, ErrorCode } from '@/shared/models/upload-response.model';

@Injectable({
  providedIn: 'root',
})
export class ViewVersionService {
  versionViewLabel$: Observable<string>;
  versionView$: Observable<DocumentViewResponse | null>;
  versionId$: Observable<string | null>;
  cleanVersionView$: Observable<DocumentViewResponse | null>;

  private versionIdBS = new Subject<string | null>();
  private versionViewBS = new BehaviorSubject<DocumentViewResponse>(null);
  private cleanVersionViewBS = new BehaviorSubject<DocumentViewResponse | null>(
    null,
  );
  get isOriginalLanguageView() {
    return this._isOriginalLanguageView;
  }
  private _isOriginalLanguageView = false;

  constructor(
    private documentService: DocumentService,
    private syncScrollService: SyncDocumentScrollService,
    private pageModeService: PageModeService,
    private translateService: TranslateService,
    private zoombarService: ZoombarService,
    private http: HttpClient,
    private growlService: EuiGrowlService,
  ) {
    this.versionId$ = this.versionIdBS.asObservable();
    this.versionView$ = this.versionViewBS.asObservable();
    this.cleanVersionView$ = this.cleanVersionViewBS.asObservable();

    combineLatest([
      this.versionId$,
      this.documentService.documentRefAndCategory$,
    ])
      .pipe(
        filter(
          ([versionId, _]) =>
            versionId !== null || typeof versionId !== 'object',
        ),
        distinctUntilChanged(),
        tap(() => this.pageModeService.setPageMode(PageMode.ViewVersion)),
        switchMap(([versionId, documentInfo]) =>
          this.getDocumentVersion(documentInfo.category, versionId),
        ),
      )
      .subscribe((versionView) => {
        this.initViewVersion(versionView);
      });

    this.versionViewLabel$ = combineLatest([
      this.versionView$,
      this.cleanVersionView$,
    ]).pipe(
      filter(([vv, cvv]) => !!vv || !!cvv),
      map(([versionView, cleanVersionView]) => {
        const versionTitle = versionView
          ? this.getVersionViewTitle(versionView.versionInfoVO)
          : this.getVersionViewTitle(cleanVersionView.versionInfoVO);
        return this._isOriginalLanguageView
          ? this.translateService.instant('version.view.original-language-prefix') + ' - ' + versionTitle
          : versionTitle;
      }),
    );
  }

  closeVersionView() {
    this.zoombarService.resetAllZoomLevels();
    this.versionViewBS.next(null);
    this.versionIdBS.next(null);
    this.syncScrollService.setSyncScroll(false);
    this.cleanVersionViewBS.next(null);
    this._isOriginalLanguageView = false;
    this.pageModeService.setPageMode(PageMode.Normal);
  }

  toggleSyncScroll() {
    const current = this.syncScrollService.isSyncScrollEnabled;
    this.syncScrollService.setSyncScroll(!current);
  }

  setVersionIdToView(versionNumber: string) {
    this._isOriginalLanguageView = false;
    this.versionIdBS.next(versionNumber);
  }

  viewOriginalLanguageVersion() {
    const documentType = this.documentService.documentType;
    const documentRef = this.documentService.documentRef;
    this._isOriginalLanguageView = true;
    this.pageModeService.setPageMode(PageMode.ViewVersion);
    this.http.get<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/original-language-version`,
    ).subscribe({
      next: (versionView) => {
        this.initViewVersion(versionView);
      },
      error: (err) => {
        this._isOriginalLanguageView = false;
        this.pageModeService.setPageMode(PageMode.Normal);
        const exceptionResponse: ExceptionResponseVO = err.error;
        const messageKey = exceptionResponse?.errorCode === ErrorCode.OLV001
          ? exceptionResponse.messageKey
          : 'version.view.original-language.error.generic';
        this.growlService.growl({
          severity: 'danger',
          detail: this.translateService.instant(messageKey),
        });
      },
    });
  }

  public toggleViewCleanVersion(): void {
    const nextIsViewEnabled = !this.cleanVersionViewBS.value;
    if (!nextIsViewEnabled) {
      this.closeVersionView();
    } else {
      this.initCleanVersionView();
    }
  }

  private initViewVersion(versionView: DocumentViewResponse) {
    this.versionViewBS.next(versionView);
    this.syncScrollService.setSyncScroll(true);
    this.pageModeService.setPageMode(PageMode.ViewVersion);
  }

  private getVersionViewTitle(versionInfo: VersionInfoVO) {
    return this.translateService.instant('version.view.header', {
      version: versionInfo.documentVersion,
      updatedByFull: `${versionInfo.lastModifiedBy} (${versionInfo.entity})`,
      updatedOn: versionInfo.lastModificationInstant,
    });
  }

  private clearCleanVersionView() {
    this.pageModeService.setPageMode(PageMode.Normal);
    this.cleanVersionViewBS.next(null);
    this.syncScrollService.setSyncScroll(false);
  }

  private initCleanVersionView() {
    this.versionViewBS.next(null);
    this.fetchViewCleanVersion().subscribe((cleanVersion) => {
      this.pageModeService.setPageMode(PageMode.ViewVersion);
      this.cleanVersionViewBS.next(cleanVersion);
      this.syncScrollService.setSyncScroll(true);
    });
  }

  private fetchViewCleanVersion() {
    const documentType = this.documentService.documentType;
    const documentRef = this.documentService.documentRef;

    return this.http.get<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/clean-version`,
    );
  }

  private getDocumentVersion(documentType: string, versionId: string) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http.get<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${versionId}/show-version`,
    );
  }
}
