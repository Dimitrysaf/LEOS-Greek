import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionPaneGroupComponent } from './revision-pane-group.component';

describe('RevisionPaneGroupComponent', () => {
  let component: RevisionPaneGroupComponent;
  let fixture: ComponentFixture<RevisionPaneGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisionPaneGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevisionPaneGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
