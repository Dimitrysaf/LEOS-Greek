/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ProposalMilestoneSendCopyDialogComponent } from './proposal-milestone-send-copy-dialog.component';

describe('ProposalMilestoneSendCopyDialogComponent', () => {
  let component: ProposalMilestoneSendCopyDialogComponent;
  let fixture: ComponentFixture<ProposalMilestoneSendCopyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalMilestoneSendCopyDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalMilestoneSendCopyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
