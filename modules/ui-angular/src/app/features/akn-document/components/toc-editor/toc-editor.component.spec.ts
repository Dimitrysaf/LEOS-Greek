import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TocEditorComponent } from './toc-editor.component';

describe('TocEditorComponent', () => {
  let component: TocEditorComponent;
  let fixture: ComponentFixture<TocEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TocEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TocEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
