import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ɵElement,
  Validators,
} from '@angular/forms';
import { DIALOG_COMPONENT_CONFIG } from '@eui/components/eui-dialog';
import { EuiAppShellService, EuiGrowlService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import { filter, Subject } from 'rxjs';

import { DocumentService } from '@/shared/services/document.service';

import { DocType } from '../../models/import.model';
import { ImportService } from '../../services/import.service';
import { ImportManager } from '../import-from-journal-dialog/import-manager';

@Component({
  selector: 'app-import-from-journal',
  templateUrl: './import-from-journal.component.html',
  styleUrls: ['./import-from-journal.component.scss'],
})
export class ImportFromJournalComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Output() accepted: EventEmitter<void> = new EventEmitter();

  @ViewChild('docContainer', { static: false })
  docContainer: ElementRef<HTMLDivElement>;

  types: DocType[] = ['REGULATION', 'DIRECTIVE', 'DECISION'];
  years = this.getYearsSince(1980);
  searchForm: FormGroup<{
    [K in keyof {
      number: FormControl<string | null>;
      year: FormControl<number | null>;
      type: FormControl<'REGULATION' | 'DIRECTIVE' | 'DECISION' | null>;
    }]: ɵElement<
      {
        number: FormControl<string | null>;
        year: FormControl<number | null>;
        type: FormControl<'REGULATION' | 'DIRECTIVE' | 'DECISION' | null>;
      }[K],
      null
    >;
  }>;
  importManager: ImportManager;
  docLoaded = false;
  allEnactingItemsSelected = false;
  allRecitalsSelected = false;
  searching = false;
  importing = false;
  defaultType: DocType;
  defaultYear: number;

  private destroy$ = new Subject<void>();
  private activeSearchData?: { year: number; number: number; type: DocType };

  constructor(
    @Inject(DIALOG_COMPONENT_CONFIG) private config,
    private formBuilder: FormBuilder,
    private documentService: DocumentService,
    private importService: ImportService,
    private euiAppShellService: EuiAppShellService,
    private euiGrowlService: EuiGrowlService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.searchForm = this.createFormGroup();
    this.defaultType = this.types[0];
    this.defaultYear = this.years[0];
    this.searchForm.patchValue({
      type: this.defaultType,
      year: this.defaultYear,
    });
  }

  ngAfterViewInit(): void {
    if (!this.importManager) {
      this.importManager = this.config.importManager;
      this.importManager.count$
        .pipe(filter((count) => count === 0))
        .subscribe(() => {
          this.allEnactingItemsSelected = false;
          this.allRecitalsSelected = false;
        });
    }
  }

  close() {
    this.activeSearchData = null;
    this.searchForm = null;
    this.docContainer.nativeElement.innerHTML = '';
    this.docLoaded = false;
    this.importManager.destroy();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchSubmit() {
    const searchData = this.getSearchFormData();
    const params = {
      documentRef: this.documentService.documentRef,
      ...searchData,
    };
    if (this.searchForm.valid) {
      this.searching = true;
      const startTime = Date.now();

      this.importService.searchForImport(params).subscribe({
        next: (html) => {
          this.activeSearchData = html ? searchData : null;
          this.config.setSearchDataCallback(this.activeSearchData);
          this.setDocHtml(html);
          if (!html) this.showNoResultsMessage();
        },
        error: (err) => {
          console.warn('stub:', 'importService.onSearchSubmit error', err); // FIXME
        },
        complete: () => {
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(1000 - elapsedTime, 0);

          setTimeout(() => {
            this.searching = false;
            this.cdr.detectChanges();
          }, remainingTime);
        },
      });
    } else {
      this.searchForm.markAllAsTouched();
    }
  }

  toggleSelectAllEnactingItems(select = !this.allEnactingItemsSelected) {
    this.allEnactingItemsSelected = select;
    this.importManager?.selectAllEnactingItems(select);
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

    if (this.docContainer.nativeElement.innerHTML === "") {
      this.docLoaded = false;
    } else {
      this.docLoaded = true;
    }
    // add eui checkbox styles to restore visibility
    this.docContainer.nativeElement
      .querySelectorAll(`input[type="checkbox"][data-element-type="import"]`)
      .forEach((el) => el.classList.add('eui-input-checkbox'));
  }

  private showNoResultsMessage() {
    const message = this.translateService.instant(
      'dialog.import-from-journal.notifications.no-results',
    );
    this.euiAppShellService.isBlockDocumentActive = false;
    this.euiGrowlService.growl({
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
    this.euiAppShellService.isBlockDocumentActive = false;
    this.euiGrowlService.growl({
      severity: 'success',
      // summary: title,
      detail: message,
      life: 4000,
    });
  }
}
