import { TestBed } from '@angular/core/testing';

import { CreateProposalService } from './create-proposal.service';

describe('CreateProposalService', () => {
  let service: CreateProposalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateProposalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
