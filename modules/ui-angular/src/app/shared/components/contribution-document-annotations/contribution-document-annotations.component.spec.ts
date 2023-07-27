import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionDocumentAnnotationsComponent } from './contribution-document-annotations.component';

describe('ContributionDocumentAnnotationsComponent', () => {
  let component: ContributionDocumentAnnotationsComponent;
  let fixture: ComponentFixture<ContributionDocumentAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributionDocumentAnnotationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributionDocumentAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
