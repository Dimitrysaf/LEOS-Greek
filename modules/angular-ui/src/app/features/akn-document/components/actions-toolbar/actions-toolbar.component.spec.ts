import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsToolbarComponent } from './actions-toolbar.component';

describe('ActionsToolbarComponent', () => {
  let component: ActionsToolbarComponent;
  let fixture: ComponentFixture<ActionsToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionsToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
