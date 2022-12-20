import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalViewComponent } from './proposal-view.component';

describe('ProposalDetailsComponent', () => {
  let component: ProposalViewComponent;
  let fixture: ComponentFixture<ProposalViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
