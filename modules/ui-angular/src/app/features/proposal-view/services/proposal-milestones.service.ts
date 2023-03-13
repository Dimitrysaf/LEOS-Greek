import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Document } from '@leos/shared';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  shareReplay,
  tap,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { apiBaseUrl } from 'src/config';

import { Milestone } from '../models/milestone.model';
import { ProposalDetailsService } from './proposal-details.service';

@Injectable({
  providedIn: 'root',
})
export class ProposalMilestonesService {
  constructor(private http: HttpClient) {}

  getProposalMilestones(documentRef: string) {
    return this.http
      .get(`${apiBaseUrl}/secured/proposal/${documentRef}/milestones`)
      .pipe(
        map((res: any) => {
          console.log('Milestones response => ', res);
          return res.milestones;
        }),
      );
  }

  addMilestone(proposalId: string, newMilestone: Milestone) {
    // return this.http.put(
    //   `api/secured/proposals/${proposalId}/milestones/`,
    //   newMilestone
    // );
  }

  deleteMilestone(milestoneId: string) {
    // API details not finalized
    // return this.http.delete(
    //   `api/secured/proposals/${this.proposalId$}/milestones/${milestoneId}`
    // );
  }
}
