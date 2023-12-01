import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVersionsPaneComponent } from './search-versions-pane.component';

describe('SearchVersionsPaneComponent', () => {
  let component: SearchVersionsPaneComponent;
  let fixture: ComponentFixture<SearchVersionsPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchVersionsPaneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchVersionsPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
