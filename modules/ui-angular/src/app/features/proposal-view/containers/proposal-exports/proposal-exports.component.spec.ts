import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalExportsComponent } from './proposal-exports.component';

describe('ProposalExportsComponent', () => {
  let component: ProposalExportsComponent;
  let fixture: ComponentFixture<ProposalExportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalExportsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalExportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
