import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AknDocumentComponent } from './akn-document.component';

describe('AknDocumentComponent', () => {
  let component: AknDocumentComponent;
  let fixture: ComponentFixture<AknDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
