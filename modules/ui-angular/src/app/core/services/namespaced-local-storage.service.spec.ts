import { TestBed } from '@angular/core/testing';

import { NamespacedLocalStorageService } from './namespaced-local-storage.service';

describe('NamespacedLocalStorageService', () => {
  let service: NamespacedLocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NamespacedLocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
