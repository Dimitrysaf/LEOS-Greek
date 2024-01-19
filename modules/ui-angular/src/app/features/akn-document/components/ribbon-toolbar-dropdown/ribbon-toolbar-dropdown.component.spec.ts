import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RibbonToolbarDropdownComponent } from './ribbon-toolbar-dropdown.component';

describe('RibbonToolbarDropdownComponent', () => {
  let component: RibbonToolbarDropdownComponent;
  let fixture: ComponentFixture<RibbonToolbarDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RibbonToolbarDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RibbonToolbarDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
