import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EuiDialogConfig, EuiDialogService } from '@eui/components/eui-dialog';
import { UxAppShellService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import { apiBaseUrl } from 'src/config';

import { ImportFromJournalComponent } from '@/features/akn-document/components/import-from-journal/import-from-journal.component';
import { ImportManager } from '@/features/akn-document/components/import-from-journal-dialog/import-manager';
import { DocType } from '@/features/akn-document/models/import.model';
import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';
import { DocumentService } from '@/shared/services/document.service';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    private documentService: DocumentService,
    private translateService: TranslateService,
    private uxAppShellService: UxAppShellService,
    private leos: LeosLegacyService,
    private dialogService: EuiDialogService,
  ) {}

  searchForImport(params: {
    documentRef: string;
    type: DocType;
    year: number;
    number: number;
  }) {
    const { documentRef, ...body } = params;
    return this.http.put(
      `${apiBaseUrl}/secured/bill/${documentRef}/search-for-import`,
      body,
      { responseType: 'text' },
    );
  }

  importElements(params: {
    documentRef: string;
    type: DocType;
    year: number;
    number: number;
    elementIds: string[];
  }) {
    const { documentRef, ...body } = params;
    return this.http.put(
      `${apiBaseUrl}/secured/bill/${documentRef}/import-elements`,
      body,
      { responseType: 'text' },
    );
  }

  public openImportOJDialog() {
    const docContainer = this.document.querySelector('.docContainer');
    const importManager = new ImportManager(this.leos, docContainer);
    let activeSearchData = { year: null, number: null, type: null };

    this.dialogService.openDialog(
      new EuiDialogConfig({
        dialogId: 'import-oj-dialog-id',
        title: this.translateService.instant(
          'dialog.import-from-journal.dialog-title',
        ),
        bodyComponent: {
          component: ImportFromJournalComponent,
          config: {
            importManager,
            setSearchDataCallback: (data: any) => {
              activeSearchData = data;
            },
          },
        },
        width: 'calc(100vw - 2rem)',
        height: 'calc(100vh - 2rem - 50px - 70px)',
        acceptLabel: 'dialog.import-from-journal.footer.import-button',
        accept: () => {
          this.handleImportDialogAccept(importManager, activeSearchData);
        },
      }),
    );
  }

  private async handleImportDialogAccept(
    importManager: ImportManager,
    searchData: any,
  ) {
    const elementIds = await importManager.getSelectedElements();
    const params = {
      documentRef: this.documentService.documentRef,
      elementIds,
      ...searchData,
    };
    this.importElements(params).subscribe({
      next: () => {
        this.documentService.reloadDocument();
        this.showSuccessMessage(elementIds);
      },
      error: (err) => {
        console.warn('stub:', 'importService.importElements error', err); // FIXME
      },
    });
  }

  private showSuccessMessage(elementIds: string[]) {
    const haveRecitals = elementIds.some((id) => id.startsWith('rec_'));
    const haveArticles = elementIds.some((id) => id.startsWith('art_'));
    const key =
      haveRecitals && haveArticles
        ? 'dialog.import-from-journal.notifications.inserted-recitalsAndArticles'
        : haveRecitals
        ? 'dialog.import-from-journal.notifications.inserted-recitals'
        : haveArticles
        ? 'dialog.import-from-journal.notifications.inserted-articles'
        : 'dialog.import-from-journal.notifications.inserted';
    const message = this.translateService.instant(key);
    this.uxAppShellService.isBlockDocumentActive = false;
    this.uxAppShellService.growl({
      severity: 'success',
      // summary: title,
      detail: message,
      life: 4000,
    });
  }
}
