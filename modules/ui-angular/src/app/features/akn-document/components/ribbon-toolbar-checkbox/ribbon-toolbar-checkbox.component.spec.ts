import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RibbonToolbarCheckboxComponent } from './ribbon-toolbar-checkbox.component';

describe('RibbonToolbarCheckboxComponent', () => {
  let component: RibbonToolbarCheckboxComponent;
  let fixture: ComponentFixture<RibbonToolbarCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RibbonToolbarCheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RibbonToolbarCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
