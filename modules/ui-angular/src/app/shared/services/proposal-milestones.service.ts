import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiBaseUrl } from 'src/config';

import type { MilestoneViewItem } from '@/features/proposal-view/models/milestone.model';
import { LoadingService } from '@/shared/services/loading.service';
import { downloadBlob } from '@/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class ProposalMilestonesService {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
  ) {}

  listMilestoneView(proposalRef: string, legFileName: string) {
    return this.http.get<MilestoneViewItem[]>(
      `${apiBaseUrl}/secured/list-milestones-view/${proposalRef}`,
      {
        params: { legFileName },
      },
    );
  }

  exportMilestonePdf(documentRef: string, legFileName: string) {
    this.loadingService.setLoading(true);
    return this.http
      .get<any>(
        `${apiBaseUrl}/secured/list-milestones-view/pdf-export/${documentRef}`,
        {
          params: { legFileName },
        },
      )
      .subscribe({
        next: (blob) => downloadBlob(blob, `Proposal_${documentRef}.pdf`),
        complete: () => this.loadingService.setLoading(false),
      });
  }
}
