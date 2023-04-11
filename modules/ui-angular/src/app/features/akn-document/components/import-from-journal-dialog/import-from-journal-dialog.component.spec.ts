import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFromJournalDialogComponent } from './import-from-journal-dialog.component';

describe('ImportFromJournalDialogComponent', () => {
  let component: ImportFromJournalDialogComponent;
  let fixture: ComponentFixture<ImportFromJournalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportFromJournalDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportFromJournalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
