import { TestBed } from '@angular/core/testing';

import { LeosLegacyService } from './leos-legacy.service';

describe('LeosLegacyService', () => {
  let service: LeosLegacyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeosLegacyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
