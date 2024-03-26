/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NotificationUploadWizardComponent } from './notification-upload.component';

describe('NotificationUploadWizardComponent', () => {
  let component: NotificationUploadComponent;
  let fixture: ComponentFixture<NotificationUploadWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationUploadWizardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationUploadWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
