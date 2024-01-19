import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RibbonToolbarBaseComponent } from './ribbon-toolbar-base.component';

describe('RibbonToolbarBaseComponent', () => {
  let component: RibbonToolbarBaseComponent;
  let fixture: ComponentFixture<RibbonToolbarBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RibbonToolbarBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RibbonToolbarBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
