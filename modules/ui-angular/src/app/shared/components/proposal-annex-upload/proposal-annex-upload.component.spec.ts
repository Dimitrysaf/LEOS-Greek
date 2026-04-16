import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalAnnexUploadComponent } from './proposal-annex-upload.component';

describe('ProposalAnnexUploadComponent', () => {
  let component: ProposalAnnexUploadComponent;
  let fixture: ComponentFixture<ProposalAnnexUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalAnnexUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProposalAnnexUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
