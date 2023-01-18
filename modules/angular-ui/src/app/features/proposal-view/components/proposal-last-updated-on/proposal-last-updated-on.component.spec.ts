import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalLastUpdatedOnComponent } from './proposal-last-updated-on.component';

describe('ProposalLastUpdatedOnComponent', () => {
  let component: ProposalLastUpdatedOnComponent;
  let fixture: ComponentFixture<ProposalLastUpdatedOnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalLastUpdatedOnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalLastUpdatedOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
