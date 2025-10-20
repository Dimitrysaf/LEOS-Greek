import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalViewCustomTemplateComponent } from './proposal-view-custom-template.component';

describe('ProposalViewCustomTemplateComponent', () => {
  let component: ProposalViewCustomTemplateComponent;
  let fixture: ComponentFixture<ProposalViewCustomTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalViewCustomTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalViewCustomTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
