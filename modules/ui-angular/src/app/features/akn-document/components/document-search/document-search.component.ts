import { Component, HostBinding, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';

import { DocumentSearchParams } from '@/features/akn-document/models';
import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-document-search',
  templateUrl: './document-search.component.html',
  styleUrls: ['./document-search.component.scss'],
})
export class DocumentSearchComponent implements OnDestroy {
  @HostBinding('class.isReplace') isReplace = false;

  form = new FormGroup({
    searchText: new FormControl(''),
    wholeWords: new FormControl(false),
    matchCase: new FormControl(false),
    replaceText: new FormControl(''),
  });
  replaceText = '';

  private destroy$ = new Subject<void>();

  constructor(public doc: DocumentService) {
    this.doc.searchParams$.pipe(take(1)).subscribe((params) => {
      this.form.patchValue(params);
    });
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const values = this.getFormValues();
      this.doc.setSearchParams(values);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setReplaceText(event: Event) {
    this.replaceText = (event.target as HTMLInputElement).value;
  }

  toggleReplace(isReplace = !this.isReplace) {
    this.isReplace = isReplace;
  }

  private getFormValues(): DocumentSearchParams {
    const { searchText, matchCase, wholeWords } = this.form.getRawValue();
    return {
      searchText: searchText ?? '',
      matchCase,
      wholeWords,
    };
  }
}
