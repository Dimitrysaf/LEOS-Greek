import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexActionsDropdownComponent } from './annex-actions-dropdown.component';

describe('AnnexActionsDropdownComponent', () => {
  let component: AnnexActionsDropdownComponent;
  let fixture: ComponentFixture<AnnexActionsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnexActionsDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnexActionsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
