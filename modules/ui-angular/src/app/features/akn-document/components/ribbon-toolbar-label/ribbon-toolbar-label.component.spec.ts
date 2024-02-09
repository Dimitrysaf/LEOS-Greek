import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RibbonToolbarLabelComponent } from './ribbon-toolbar-label.component';

describe('RibbonToolbarLabelComponent', () => {
  let component: RibbonToolbarLabelComponent;
  let fixture: ComponentFixture<RibbonToolbarLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RibbonToolbarLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RibbonToolbarLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
