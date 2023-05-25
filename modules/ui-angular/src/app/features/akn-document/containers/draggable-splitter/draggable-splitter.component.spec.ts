import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableSplitterComponent } from './draggable-splitter.component';

describe('DraggableSplitterComponent', () => {
  let component: DraggableSplitterComponent;
  let fixture: ComponentFixture<DraggableSplitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DraggableSplitterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DraggableSplitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
