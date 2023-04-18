import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { Milestone, MilestoneViewItem } from '../models/milestone.model';

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

  listMilestoneView(proposalRef: string, legFileName: string) {
    return this.http.get<MilestoneViewItem[]>(
      `${apiBaseUrl}/secured/list-milestones-view/${proposalRef}`,
      {
        params: { legFileName },
      },
    );
  }
}
