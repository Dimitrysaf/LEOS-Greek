import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeTocActionsComponent } from './node-toc-actions.component';

describe('NodeTocActionsComponent', () => {
  let component: NodeTocActionsComponent;
  let fixture: ComponentFixture<NodeTocActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeTocActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NodeTocActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
