import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentActionsDropdownComponent } from './document-actions-dropdown.component';

describe('AnnexActionsDropdownComponent', () => {
  let component: DocumentActionsDropdownComponent;
  let fixture: ComponentFixture<DocumentActionsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DocumentActionsDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentActionsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
