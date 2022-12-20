import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalHeaderComponent } from './proposal-header.component';

describe('ProposalHeaderComponent', () => {
  let component: ProposalHeaderComponent;
  let fixture: ComponentFixture<ProposalHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
