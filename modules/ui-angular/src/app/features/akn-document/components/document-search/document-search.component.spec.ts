import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSearchComponent } from './document-search.component';

describe('DocumentSearchComponent', () => {
  let component: DocumentSearchComponent;
  let fixture: ComponentFixture<DocumentSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DocumentSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
