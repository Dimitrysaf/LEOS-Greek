import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { debounce, debounceTime, Subject, take, takeUntil } from 'rxjs';

import { ProposalService } from '@/features/proposals/services/proposal.service';
import { Document } from '@/shared';

import { ExportPackageVO } from '../../models/export-package.model';
import { ProposalDetailsService } from '../../services/proposal-details.service';

const DEBOUNCE_TIME = 300;
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

  handleTitleChange(event: Event, data: ExportPackageVO) {
    console.log(event);
    const proposalRef = this.proposalDetailsService.proposalRef;
    data.comments[0] = (event.target as HTMLInputElement).value;
    this.proposalDetailsService
      .updateExportDocument(proposalRef, data.id, data.comments)
      .pipe(debounceTime(DEBOUNCE_TIME), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.exportDocuments = res;
      });
  }

  ngOnInit(): void {
    this.proposalDetailsService.exportedDocuments$
      .pipe(takeUntil(this.destroy$))
      .subscribe((exports) => (this.exportDocuments = exports));
  }

  handleDeleteExport(id: string) {
    const ref = this.proposalDetailsService.proposalRef;
    this.proposalDetailsService
      .deleteExportDocument(ref, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.exportDocuments = res;
      });
  }

  handleNotifyExport(id: string) {
    const ref = this.proposalDetailsService.proposalRef;
    this.proposalDetailsService
      .notifyExport(ref, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log(res);
      });
  }

  handlePreviewExport(id: string) {
    const ref = this.proposalDetailsService.proposalRef;
    this.proposalDetailsService
      .deleteExportDocument(ref, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.downloadFile(res);
      });
  }

  private downloadFile(data: any) {
    const blob = new Blob([data], {
      type: 'application/docx',
    });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
}
