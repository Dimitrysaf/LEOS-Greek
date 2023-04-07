import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadEconsiliumModalComponent } from './download-econsilium-modal.component';

describe('ExportEconsiliumModalComponent', () => {
  let component: DownloadEconsiliumModalComponent;
  let fixture: ComponentFixture<DownloadEconsiliumModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadEconsiliumModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadEconsiliumModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
