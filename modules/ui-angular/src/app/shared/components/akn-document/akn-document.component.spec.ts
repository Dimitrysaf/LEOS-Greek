import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AknDocumentComponent } from './akn-document.component';

describe('AknDocumentComponent', () => {
  let component: AknDocumentComponent;
  let fixture: ComponentFixture<AknDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AknDocumentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AknDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
