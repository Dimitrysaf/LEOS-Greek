import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RibbonToolbarButtonComponent } from './ribbon-toolbar-button.component';

describe('RibbonToolbarButtonComponent', () => {
  let component: RibbonToolbarButtonComponent;
  let fixture: ComponentFixture<RibbonToolbarButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RibbonToolbarButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RibbonToolbarButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
