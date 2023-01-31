/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ProposalUploadWizardComponent } from './proposal-upload-wizard.component';

describe('ProposalUploadWizardComponent', () => {
  let component: ProposalUploadWizardComponent;
  let fixture: ComponentFixture<ProposalUploadWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalUploadWizardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalUploadWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
