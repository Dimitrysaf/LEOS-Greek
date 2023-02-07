import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ProposalDetailsService } from './proposal-details.service';

describe('ProposalDetailsService', () => {
  let service: ProposalDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProposalDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
