import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalMilestoneViewComponent } from './proposal-milestone-view.component';

describe('ProposalMilestoneViewComponent', () => {
  let component: ProposalMilestoneViewComponent;
  let fixture: ComponentFixture<ProposalMilestoneViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalMilestoneViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalMilestoneViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
