import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalCollaboratorsComponent } from './proposal-collaborators.component';

describe('ProposalCollaboratorsComponent', () => {
  let component: ProposalCollaboratorsComponent;
  let fixture: ComponentFixture<ProposalCollaboratorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalCollaboratorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalCollaboratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
