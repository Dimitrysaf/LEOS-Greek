import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestoneTocComponent } from './milestone-toc.component';

describe('MilestoneTocComponent', () => {
  let component: MilestoneTocComponent;
  let fixture: ComponentFixture<MilestoneTocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MilestoneTocComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MilestoneTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
