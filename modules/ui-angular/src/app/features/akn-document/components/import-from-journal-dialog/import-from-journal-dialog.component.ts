import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, ɵElement} from '@angular/forms';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { UxAppShellService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { ImportManager } from '@/features/akn-document/components/import-from-journal-dialog/import-manager';
import { DocType } from '@/features/akn-document/models/import.model';
import { ImportService } from '@/features/akn-document/services/import.service';
import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';
import { DocumentService } from '@/shared/services/document.service';

import { TableOfContentService } from '../../services/table-of-content.service';

@Component({
  selector: 'app-import-from-journal-dialog',
  templateUrl: './import-from-journal-dialog.component.html',
  styleUrls: ['./import-from-journal-dialog.component.scss'],
})
export class ImportFromJournalDialogComponent implements OnInit {
  @ViewChild('dialog') dialog: EuiDialogComponent;
  @ViewChild('docContainer') docContainer: ElementRef<HTMLDivElement>;
  types: DocType[] = ['REGULATION', 'DIRECTIVE', 'DECISION'];
  years = this.getYearsSince(1980);
  searchForm: FormGroup<{ [K in keyof { number: FormControl<string | null>; year: FormControl<number | null>; type: FormControl<"REGULATION" | "DIRECTIVE" | "DECISION" | null> }]: ɵElement<{ number: FormControl<string | null>; year: FormControl<number | null>; type: FormControl<"REGULATION" | "DIRECTIVE" | "DECISION" | null> }[K], null> }>;
  importManager: ImportManager;
  docLoaded = false;
  allArticlesSelected = false;
  allRecitalsSelected = false;
  searching = false;
  importing = false;

  private activeSearchData?: { year: number; number: number; type: DocType };

  constructor(
    private formBuilder: FormBuilder,
    public doc: DocumentService,
    private importService: ImportService,
    private leos: LeosLegacyService,
    private documentService: DocumentService,
    private tableOfContentService: TableOfContentService,
    private uxAppShellService: UxAppShellService,
    private translateService: TranslateService,
  ) {
    this.searchForm = this.createFormGroup();
  }

  ngOnInit() {}

  open() {
    if (!this.importManager) {
      this.importManager = new ImportManager(
        this.leos,
        this.docContainer.nativeElement,
      );
      this.importManager.count$
        .pipe(filter((count) => count === 0))
        .subscribe(() => {
          this.allArticlesSelected = false;
          this.allRecitalsSelected = false;
        });
    }
    this.searchForm = this.createFormGroup();
    this.dialog.openDialog();
  }

  close() {
    this.activeSearchData = null;
    this.searchForm = null;
    this.docContainer.nativeElement.innerHTML = '';
    this.docLoaded = false;
    this.importManager.destroy();
    this.dialog.closeDialog();
  }

  async accept() {
    const elementIds = await this.importManager.getSelectedElements();
    const params = {
      documentRef: this.documentService.documentRef,
      elementIds,
      ...this.activeSearchData,
    };
    this.importing = true;
    this.importService.importElements(params).subscribe({
      next: () => {
        this.documentService.reloadDocument();
        this.showSuccessMessage(elementIds);
        this.close();
      },
      error: (err) => {
        console.warn('stub:', 'importService.importElements error', err); // FIXME
      },
      complete: () => {
        this.importing = false;
      },
    });
  }

  onSearchSubmit() {
    const searchData = this.getSearchFormData();
    const params = {
      documentRef: this.documentService.documentRef,
      ...searchData,
    };
    if (this.searchForm.valid) {
      this.searching = true;
      this.importService.searchForImport(params).subscribe({
        next: (html) => {
          this.activeSearchData = html ? searchData : null;
          this.setDocHtml(html);
          if (!html) this.showNoResultsMessage();
        },
        error: (err) => {
          console.warn('stub:', 'importService.onSearchSubmit error', err); // FIXME
        },
        complete: () => {
          this.searching = false;
        },
      });
    } else {
      this.searchForm.markAllAsTouched();
    }
  }

  toggleSelectAllArticles(select = !this.allArticlesSelected) {
    this.allArticlesSelected = select;
    this.importManager?.selectAllElements(select, 'article');
  }

  toggleSelectAllRecitals(select = !this.allRecitalsSelected) {
    this.allRecitalsSelected = select;
    this.importManager?.selectAllElements(select, 'recital');
  }

  private createFormGroup() {
    return this.formBuilder.group({
      type: new FormControl(this.types[0], [Validators.required]),
      year: new FormControl(this.years[0], [Validators.required]),
      number: new FormControl<string>(null, [
        Validators.required,
        Validators.pattern(/^\s*[1-9][0-9]*\s*$/),
        Validators.min(1),
      ]),
    });
  }

  private getYearsSince(firstYear: number): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: currentYear - firstYear + 1 },
      (_, i) => currentYear - i,
    );
  }

  private getSearchFormData() {
    const { type, year, number } = this.searchForm.getRawValue();
    return { type, year, number: Number.parseInt(number, 10) };
  }

  private setDocHtml(html: string) {
    this.docContainer.nativeElement.innerHTML = html;
    this.docLoaded = true;
    // add eui checkbox styles to restore visibility
    this.docContainer.nativeElement
      .querySelectorAll(`input[type="checkbox"][data-element-type="import"]`)
      .forEach((el) => el.classList.add('eui-input-checkbox'));
  }

  private showNoResultsMessage() {
    const message = this.translateService.instant(
      'dialog.import-from-journal.notifications.no-results',
    );
    this.uxAppShellService.isBlockDocumentActive = false;
    this.uxAppShellService.growl({
      severity: 'warning',
      detail: message,
      life: 4000,
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
