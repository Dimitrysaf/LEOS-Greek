import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalCreateDraftComponent } from './proposal-create-draft.component';

describe('ProposalCreateDraftComponent', () => {
  let component: ProposalCreateDraftComponent;
  let fixture: ComponentFixture<ProposalCreateDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalCreateDraftComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalCreateDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
