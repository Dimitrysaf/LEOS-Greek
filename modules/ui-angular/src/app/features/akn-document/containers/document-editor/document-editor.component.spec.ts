import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexEditorComponent } from './document-editor.component';

describe('AnnexEditorComponent', () => {
  let component: AnnexEditorComponent;
  let fixture: ComponentFixture<AnnexEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnexEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnexEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
