import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneAnnotationWarningModalComponent } from './milestone-annotation-warning-modal.component';

describe('MilestoneAnnotationWarningModalComponent', () => {
  let component: MilestoneAnnotationWarningModalComponent;
  let fixture: ComponentFixture<MilestoneAnnotationWarningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MilestoneAnnotationWarningModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MilestoneAnnotationWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
