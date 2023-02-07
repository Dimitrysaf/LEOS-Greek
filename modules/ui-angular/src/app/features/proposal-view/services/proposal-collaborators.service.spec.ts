import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ProposalCollaboratorsService } from './proposal-collaborators.service';

describe('ProposalCollaboratorsService', () => {
  let service: ProposalCollaboratorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProposalCollaboratorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
