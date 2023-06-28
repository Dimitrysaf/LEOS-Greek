import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionPaneComponent } from './revision-pane.component';

describe('RevisionPaneComponent', () => {
  let component: RevisionPaneComponent;
  let fixture: ComponentFixture<RevisionPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RevisionPaneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RevisionPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
