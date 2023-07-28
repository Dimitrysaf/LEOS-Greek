import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EuiBreadcrumbService } from '@eui/components/layout';
import { UxAppShellService } from '@eui/core';
import { Document } from '@leos/shared';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

import { DocumentService } from '@/shared/services/document.service';

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
  isClonedProposal = false;
  originRef: string | null = null;
  proposalRef: string;

  protected readonly homeUrl = document.baseURI;

  private destroy$ = new Subject<void>();

  constructor(
    public asService: UxAppShellService,
    private route: ActivatedRoute,
    private proposalDetailsService: ProposalDetailsService,
    private translateService: TranslateService,
    private documentService: DocumentService,
    public breadcrumbService: EuiBreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.manageBreadCrumbsProposalView();
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
          this.isClonedProposal = Boolean(
            proposal.cloneProposalMetadataVO?.clonedProposal,
          );
          this.documentService.setIsClonedProposal(
            Boolean(proposal.cloneProposalMetadataVO?.clonedProposal),
          );
          this.originRef = proposal.cloneProposalMetadataVO?.originRef ?? null;
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
    this.proposalRef = id;
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

  private manageBreadCrumbsProposalView() {
    this.breadcrumbService.setBreadcrumb([
      {
        id: 'home',
        label: this.translateService.instant('global.breadcrumb.proposals'),
        link: `/workspace`,
      },
      {
        id: 'proposal_view',
        label: this.translateService.instant('global.breadcrumb.proposal_view'),
        link: null,
      },
    ]);
  }
}
