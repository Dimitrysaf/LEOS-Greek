import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesManagerComponent } from './entities-manager.component';

describe('EntitiesManagerComponent', () => {
  let component: EntitiesManagerComponent;
  let fixture: ComponentFixture<EntitiesManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntitiesManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntitiesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
