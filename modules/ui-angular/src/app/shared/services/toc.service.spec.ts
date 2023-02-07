/* tslint:disable:no-unused-variable */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';

import { TocService } from './toc.service';

describe('Service: Toc', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TocService],
    });
  });

  it('should ...', inject([TocService], (service: TocService) => {
    expect(service).toBeTruthy();
  }));
});
