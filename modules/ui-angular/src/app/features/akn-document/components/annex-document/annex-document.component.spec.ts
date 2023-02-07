import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexDocumentComponent } from './annex-document.component';

describe('AnnexDocumentComponent', () => {
  let component: AnnexDocumentComponent;
  let fixture: ComponentFixture<AnnexDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AnnexDocumentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnexDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
