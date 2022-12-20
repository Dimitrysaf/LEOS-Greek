import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalDraftsComponent } from './proposal-drafts.component';

describe('ProposalDraftsComponent', () => {
  let component: ProposalDraftsComponent;
  let fixture: ComponentFixture<ProposalDraftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalDraftsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalDraftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
