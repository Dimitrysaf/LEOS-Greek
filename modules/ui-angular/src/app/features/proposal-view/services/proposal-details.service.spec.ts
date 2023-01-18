import { TestBed } from '@angular/core/testing';

import { ProposalDetailsService } from './proposal-details.service';

describe('ProposalDetailsService', () => {
  let service: ProposalDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProposalDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
