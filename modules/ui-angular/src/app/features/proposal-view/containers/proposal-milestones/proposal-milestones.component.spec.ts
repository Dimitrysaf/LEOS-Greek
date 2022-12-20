import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalMilestonesComponent } from './proposal-milestones.component';

describe('ProposalMilestonesComponent', () => {
  let component: ProposalMilestonesComponent;
  let fixture: ComponentFixture<ProposalMilestonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalMilestonesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalMilestonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
