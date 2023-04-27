import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveVersionDialogComponent } from './save-version-dialog.component';

describe('SaveVersionDialogComponent', () => {
  let component: SaveVersionDialogComponent;
  let fixture: ComponentFixture<SaveVersionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveVersionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveVersionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
