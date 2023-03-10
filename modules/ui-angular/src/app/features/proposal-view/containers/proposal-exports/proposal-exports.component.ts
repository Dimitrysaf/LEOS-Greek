import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { ProposalService } from '@/features/proposals/services/proposal.service';
import { Document } from '@/shared';

import { ExportPackageVO } from '../../models/export-package.model';
import { ProposalDetailsService } from '../../services/proposal-details.service';

@Component({
  selector: 'app-proposal-exports',
  templateUrl: './proposal-exports.component.html',
  styleUrls: ['./proposal-exports.component.scss'],
})
export class ProposalExportsComponent implements OnInit, OnDestroy {
  @Input() proposal: Document;

  exportDocuments: ExportPackageVO[];
  destroy$: Subject<any> = new Subject<any>();

  constructor(private proposalDetailsService: ProposalDetailsService) {}

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.proposalDetailsService.exportedDocuments$
      .pipe(takeUntil(this.destroy$))
      .subscribe((exports) => (this.exportDocuments = exports));
  }
}
