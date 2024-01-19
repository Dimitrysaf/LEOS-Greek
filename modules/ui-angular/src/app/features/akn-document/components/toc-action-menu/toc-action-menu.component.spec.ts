/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TocActionMenuComponent } from './toc-action-menu.component';

describe('TocActionMenuComponent', () => {
  let component: TocActionMenuComponent;
  let fixture: ComponentFixture<TocActionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TocActionMenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TocActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
