import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalActionsDropdownComponent } from './proposal-actions-dropdown.component';

describe('ProposalActionsDropdownComponent', () => {
  let component: ProposalActionsDropdownComponent;
  let fixture: ComponentFixture<ProposalActionsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProposalActionsDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalActionsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
