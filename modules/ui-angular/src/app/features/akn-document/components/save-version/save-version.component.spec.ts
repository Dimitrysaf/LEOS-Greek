/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SaveVersionComponent } from './save-version.component';

describe('SaveVersionComponent', () => {
  let component: SaveVersionComponent;
  let fixture: ComponentFixture<SaveVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveVersionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
