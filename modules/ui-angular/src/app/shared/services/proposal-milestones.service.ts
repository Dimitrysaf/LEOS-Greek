import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { apiBaseUrl } from 'src/config';
import { parse as parseContentDisposition } from 'content-disposition-attachment';

import type {
  MilestoneViewItem,
  MilestoneViewResponse,
} from '@/features/proposal-view/models/milestone.model';
import { LoadingService } from '@/shared/services/loading.service';
import { downloadBlob } from '@/shared/utils';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ProposalMilestonesService {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  listMilestoneView(proposalRef: string, legFileName: string) {
    return this.http.get<MilestoneViewResponse>(
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
        next: (response) => {
          const cd = parseContentDisposition(
            response.headers.get('Content-Disposition'),
          );
          const filename = cd.attachment
            ? cd.filename
            : `Proposal_${documentRef}.pdf`;
          downloadBlob(response, filename, this.document);
        },
        complete: () => this.loadingService.setLoading(false),
      });
  }
}
