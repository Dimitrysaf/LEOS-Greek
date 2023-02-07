import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalsFiltersComponent } from './proposals-filters.component';

describe('ProposalsFiltersComponent', () => {
  let component: ProposalsFiltersComponent;
  let fixture: ComponentFixture<ProposalsFiltersComponent>;

  beforeEach(async () => {
    // FIXME: This causes chrome-headless to freeze (ProposalService)
    // await TestBed.configureTestingModule({
    //   declarations: [ProposalsFiltersComponent],
    // }).compileComponents();
    //
    // fixture = TestBed.createComponent(ProposalsFiltersComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
