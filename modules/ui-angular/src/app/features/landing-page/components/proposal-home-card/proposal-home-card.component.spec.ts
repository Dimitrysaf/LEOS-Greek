/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LandingPageCard } from './proposal-home-card.component';

describe('LandingPageCardComponent', () => {
  let component: LandingPageCard;
  let fixture: ComponentFixture<LandingPageCard>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LandingPageCard],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
