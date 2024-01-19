import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RibbonToolbarContainerComponent } from './ribbon-toolbar-container.component';

describe('RibbonToolbarContainerComponent', () => {
  let component: RibbonToolbarContainerComponent;
  let fixture: ComponentFixture<RibbonToolbarContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RibbonToolbarContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RibbonToolbarContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
