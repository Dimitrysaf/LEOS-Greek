import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

import { apiBaseUrl } from '../../../../config';
import { SyncDocumentScrollService } from './sync-document-scroll.service';

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

  constructor(
    private documentService: DocumentService,
    private syncScrollService: SyncDocumentScrollService,
    private pageModeService: PageModeService,
    private translateService: TranslateService,
    private http: HttpClient,
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
        if (versionView)
          return this.getVersionViewTitle(versionView.versionInfoVO);
        else return this.getVersionViewTitle(cleanVersionView.versionInfoVO);
      }),
    );
  }

  closeVersionView() {
    this.documentService.resetZoomValues();
    this.versionViewBS.next(null);
    this.versionIdBS.next(null);
    this.syncScrollService.setSyncScroll(false);
    this.pageModeService.setPageMode(PageMode.Normal);
    this.cleanVersionViewBS.next(null);
  }

  toggleSyncScroll() {
    const current = this.syncScrollService.isSyncScrollEnabled;
    this.syncScrollService.setSyncScroll(!current);
  }

  setVersionIdToView(versionNumber: string) {
    this.versionIdBS.next(versionNumber);
  }

  public toggleViewCleanVersion(): void {
    const nextIsViewEnabled = !this.cleanVersionViewBS.value;
    if (!nextIsViewEnabled) {
      this.clearCleanVersionView();
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
