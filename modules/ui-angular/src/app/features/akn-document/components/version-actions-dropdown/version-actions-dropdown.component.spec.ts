import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionActionsDropdownComponent } from './version-actions-dropdown.component';

describe('VersionActionsDropdownComponent', () => {
  let component: VersionActionsDropdownComponent;
  let fixture: ComponentFixture<VersionActionsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [VersionActionsDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VersionActionsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
