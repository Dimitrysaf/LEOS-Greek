/* tslint:disable:no-unused-variable */

import { async, inject, TestBed } from '@angular/core/testing';

import { TocService } from './toc.service';

describe('Service: Toc', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TocService],
    });
  });

  it('should ...', inject([TocService], (service: TocService) => {
    expect(service).toBeTruthy();
  }));
});
