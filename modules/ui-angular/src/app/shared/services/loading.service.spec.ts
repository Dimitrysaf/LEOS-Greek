/* tslint:disable:no-unused-variable */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('Service: Loading', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoadingService],
    });
  });

  it('should ...', inject([LoadingService], (service: LoadingService) => {
    expect(service).toBeTruthy();
  }));
});
