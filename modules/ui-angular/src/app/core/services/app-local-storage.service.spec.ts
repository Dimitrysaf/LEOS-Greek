import { TestBed } from '@angular/core/testing';

import { AppLocalStorageService } from './app-local-storage.service';

describe('AppLocalStorageService', () => {
  let service: AppLocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppLocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
