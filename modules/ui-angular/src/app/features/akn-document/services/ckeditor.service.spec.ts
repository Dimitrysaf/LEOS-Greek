import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CKEditorService } from './ckeditor.service';

describe('CKEditorService', () => {
  let service: CKEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CKEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
