import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiBaseUrl } from 'src/config';

import type { MilestoneViewItem } from '@/features/proposal-view/models/milestone.model';

@Injectable({
  providedIn: 'root',
})
export class ProposalMilestonesService {
  constructor(private http: HttpClient) {}

  listMilestoneView(proposalRef: string, legFileName: string) {
    return this.http.get<MilestoneViewItem[]>(
      `${apiBaseUrl}/secured/list-milestones-view/${proposalRef}`,
      {
        params: { legFileName },
      },
    );
  }
}
