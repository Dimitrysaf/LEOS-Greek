import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UxAppShellService } from '@eui/core';
import { Document } from '@leos/shared';
import { Subject, takeUntil } from 'rxjs';

import { ProposalDetailsService } from '../../services/proposal-details.service';

@Component({
  selector: 'app-proposal-view',
  templateUrl: './proposal-view.component.html',
  styleUrls: ['./proposal-view.component.scss'],
})
export class ProposalViewComponent implements OnDestroy, OnInit {
  proposal: Document | null = null;
  proposalState: 'loading' | 'done' | 'error' = 'loading';
  proposalError: unknown = null;
  proposalErrorCode: number | null = null;
  proposalTitleEditablePart: string;
  proposalTitleNonEditablePart: string;

  protected readonly homeUrl = document.baseURI;

  private destroy$ = new Subject<void>();

  constructor(
    public asService: UxAppShellService,
    private route: ActivatedRoute,
    private proposalDetailsService: ProposalDetailsService,
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ proposalId }) => {
        this.loadProposal(proposalId);
      });

    this.proposalDetailsService.proposalDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (proposal) => {
          this.proposalTitleNonEditablePart = `${proposal.metadata.docStage} ${proposal.metadata.docType}`;
          this.proposalTitleEditablePart = `${proposal.metadata.docPurpose}`;
          this.setStateDone(proposal);
        },
        error: (error) => this.setStateError(error),
      });
  }

  onSaveTitle(title: string) {
    this.proposalDetailsService.updateProposalMetadata(title, null);
  }

  onSaveEEA(eea: boolean) {
    this.proposalDetailsService.updateProposalMetadata(
      this.proposal.metadata.docPurpose,
      eea,
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProposal(id: string) {
    this.setStateLoading();
    this.proposalDetailsService.setProposalRef(id);
    // this.proposalDetailsService
    //   .getProposalDetails(id)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: this.setStateDone.bind(this),
    //     error: this.setStateError.bind(this),
    //   });
  }

  private setStateLoading() {
    this.proposal = null;
    this.proposalState = 'loading';
    this.proposalError = null;
    this.proposalErrorCode = null;
    setTimeout(() => {
      // work around ExpressionChangedAfterItHasBeenCheckedError
      if (this.proposalState === 'loading') {
        this.asService.isBlockDocumentActive = true;
      }
    }, 0);
  }

  private setStateDone(document: Document) {
    this.proposal = document;
    this.proposalState = 'done';
    this.proposalError = null;
    this.proposalErrorCode = null;
    this.asService.isBlockDocumentActive = false;
  }

  private setStateError(error: unknown) {
    console.log('Error => ', error);
    this.proposal = null;
    this.proposalState = 'error';
    this.proposalError = error;
    this.proposalErrorCode =
      error instanceof HttpErrorResponse ? error.status : null;
    this.asService.isBlockDocumentActive = false;
  }
}
