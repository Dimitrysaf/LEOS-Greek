import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TocActionsButtonsComponent } from './toc-actions-buttons.component';

describe('TocActionsButtonsComponent', () => {
  let component: TocActionsButtonsComponent;
  let fixture: ComponentFixture<TocActionsButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TocActionsButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TocActionsButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
