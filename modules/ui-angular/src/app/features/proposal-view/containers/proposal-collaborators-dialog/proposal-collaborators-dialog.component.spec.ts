/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ProposalCollaboratorsDialogComponent } from './proposal-collaborators-dialog.component';

describe('ProposalCollaboratorsDialogComponent', () => {
  let component: ProposalCollaboratorsDialogComponent;
  let fixture: ComponentFixture<ProposalCollaboratorsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalCollaboratorsDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalCollaboratorsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
