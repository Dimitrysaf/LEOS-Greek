import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionsPaneComponent } from './versions-pane.component';

describe('VersionsPaneComponent', () => {
  let component: VersionsPaneComponent;
  let fixture: ComponentFixture<VersionsPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [VersionsPaneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VersionsPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
