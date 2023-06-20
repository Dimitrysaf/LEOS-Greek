import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionActionsDropdownComponent } from './revision-actions-dropdown.component';

describe('RevisionActionsDropdownComponent', () => {
  let component: RevisionActionsDropdownComponent;
  let fixture: ComponentFixture<RevisionActionsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisionActionsDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevisionActionsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
