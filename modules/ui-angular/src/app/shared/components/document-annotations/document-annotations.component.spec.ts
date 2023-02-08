import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentAnnotationsComponent } from './document-annotations.component';

describe('DocumentAnnotationsComponent', () => {
  let component: DocumentAnnotationsComponent;
  let fixture: ComponentFixture<DocumentAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentAnnotationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
