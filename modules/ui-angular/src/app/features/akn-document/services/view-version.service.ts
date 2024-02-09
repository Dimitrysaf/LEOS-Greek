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

    this.versionViewLabel$ = this.versionView$.pipe(
      filter((versionView) => !!versionView),
      map((versionView) => this.getVersionViewTitle(versionView.versionInfoVO)),
    );
  }

  closeVersionView() {
    this.documentService.resetZoomValues();
    this.versionViewBS.next(null);
    this.versionIdBS.next(null);
    this.syncScrollService.setSyncScroll(false);
    this.pageModeService.setPageMode(PageMode.Normal);
  }

  toggleSyncScroll() {
    const current = this.syncScrollService.isSyncScrollEnabled;
    this.syncScrollService.setSyncScroll(!current);
  }

  setVersionIdToView(versionNumber: string) {
    this.versionIdBS.next(versionNumber);
  }

  private initViewVersion(versionView: DocumentViewResponse) {
    this.versionViewBS.next(versionView);
    this.syncScrollService.setSyncScroll(true);
    this.pageModeService.setPageMode(PageMode.ViewVersion);
  }

  private getDocumentVersion(documentType: string, versionId: string) {
    documentType = documentType === 'coverpage' ? 'coverPage' : documentType;
    return this.http.get<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${versionId}/show-version`,
    );
  }

  private getVersionViewTitle(versionInfo: VersionInfoVO) {
    return this.translateService.instant('version.view.header', {
      version: versionInfo.documentVersion,
      updatedByFull: `${versionInfo.lastModifiedBy} (${versionInfo.entity})`,
      updatedOn: versionInfo.lastModificationInstant,
    });
  }
}
