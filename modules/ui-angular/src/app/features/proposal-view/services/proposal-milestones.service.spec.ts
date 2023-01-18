import { TestBed } from '@angular/core/testing';

import { ProposalMilestonesService } from './proposal-milestones.service';

describe('ProposalMilestonesService', () => {
  let service: ProposalMilestonesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProposalMilestonesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
