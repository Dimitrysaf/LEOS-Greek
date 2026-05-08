import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { WithinDialogComponent } from './document-preview.component';

describe('WithinDialogComponent', () => {
  let component: WithinDialogComponent;
  let fixture: ComponentFixture<WithinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithinDialogComponent],
      providers: [provideNoopAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(WithinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog and set filepath', () => {
    const dialogOpenSpy = jasmine.createSpy('dialogOpen');
    component.dialogOpen.subscribe(dialogOpenSpy);
    
    const mockDialog = { openDialog: jasmine.createSpy('openDialog') };
    Object.defineProperty(component, 'dialog', {
      value: () => mockDialog,
      writable: true
    });

    component.openDialog();

    expect(dialogOpenSpy).toHaveBeenCalledWith(true);
    expect(component.filepathNeme).toBe('D:\\Users\\GUPTANI\\Downloads\\REG-cmmm1dhu5001hb0475wqigpo9-en.pdf');
    expect(mockDialog.openDialog).toHaveBeenCalled();
  });

  it('should close dialog and clear filepath', () => {
    const dialogOpenSpy = jasmine.createSpy('dialogOpen');
    component.dialogOpen.subscribe(dialogOpenSpy);
    component.filepathNeme = 'test-path';

    component.onClose();

    expect(dialogOpenSpy).toHaveBeenCalledWith(false);
    expect(component.filepathNeme).toBeUndefined();
  });
});
