import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalDraftsComponent } from './proposal-drafts.component';

describe('ProposalDraftsComponent', () => {
  let component: ProposalDraftsComponent;
  let fixture: ComponentFixture<ProposalDraftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
