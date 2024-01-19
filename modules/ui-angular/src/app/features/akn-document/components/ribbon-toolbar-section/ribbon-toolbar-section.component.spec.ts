import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RibbonToolbarSectionComponent } from './ribbon-toolbar-section.component';

describe('RibbonToolbarSectionComponent', () => {
  let component: RibbonToolbarSectionComponent;
  let fixture: ComponentFixture<RibbonToolbarSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RibbonToolbarSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RibbonToolbarSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
