import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeHandleComponent } from './resize-handle.component';

describe('ResizeHandleComponent', () => {
  let component: ResizeHandleComponent;
  let fixture: ComponentFixture<ResizeHandleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResizeHandleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResizeHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
