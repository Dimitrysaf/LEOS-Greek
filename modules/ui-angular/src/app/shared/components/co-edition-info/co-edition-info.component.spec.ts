import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoEditionInfoComponent } from './co-edition-info.component';

describe('CoEditionInfoComponent', () => {
  let component: CoEditionInfoComponent;
  let fixture: ComponentFixture<CoEditionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoEditionInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoEditionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
