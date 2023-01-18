/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ProposalCreateTemplateSelectorComponent } from './proposal-create-template-selector.component';

describe('ProposalCreateTemplateSelectorComponent', () => {
  let component: ProposalCreateTemplateSelectorComponent;
  let fixture: ComponentFixture<ProposalCreateTemplateSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalCreateTemplateSelectorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalCreateTemplateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
