import { TestBed } from '@angular/core/testing';

import { CKEditorService } from './ckeditor.service';

describe('CKEditorService', () => {
  let service: CKEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CKEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
