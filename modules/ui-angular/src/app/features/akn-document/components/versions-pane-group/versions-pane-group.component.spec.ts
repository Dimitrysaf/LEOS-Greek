import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionsPaneGroupComponent } from './versions-pane-group.component';

describe('VersionsPaneGroupComponent', () => {
  let component: VersionsPaneGroupComponent;
  let fixture: ComponentFixture<VersionsPaneGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VersionsPaneGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VersionsPaneGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
