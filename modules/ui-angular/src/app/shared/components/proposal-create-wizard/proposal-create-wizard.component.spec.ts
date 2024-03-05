/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ProposalCreateWizardComponent } from './proposal-create-wizard.component';

describe('ProposalCreateWizardComponent', () => {
  let component: ProposalCreateWizardComponent;
  let fixture: ComponentFixture<ProposalCreateWizardComponent>;

  beforeEach(async(() => {
    // FIXME: This causes chrome-headless to freeze (ProposalService)
    // TestBed.configureTestingModule({
    //   declarations: [ProposalCreateWizardComponent],
    // }).compileComponents();
  }));

  beforeEach(() => {
    // FIXME: This causes chrome-headless to freeze (ProposalService)
    // fixture = TestBed.createComponent(ProposalCreateWizardComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
