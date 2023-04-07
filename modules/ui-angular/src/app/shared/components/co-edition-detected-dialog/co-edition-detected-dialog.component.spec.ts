import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoEditionDetectedDialogComponent } from './co-edition-detected-dialog.component';

describe('CoEditionDetectedDialogComponent', () => {
  let component: CoEditionDetectedDialogComponent;
  let fixture: ComponentFixture<CoEditionDetectedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoEditionDetectedDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoEditionDetectedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
