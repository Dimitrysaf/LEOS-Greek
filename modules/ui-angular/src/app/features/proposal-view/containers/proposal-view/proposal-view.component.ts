import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewChecked, ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {EuiTabComponent, EuiTabsComponent} from '@eui/components/eui-tabs';
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
export class ProposalViewComponent
  implements OnDestroy, OnInit, AfterViewChecked
{
  proposal: Document | null = null;
  proposalState: 'loading' | 'done' | 'error' | 'active' = 'loading';
  proposalError: unknown = null;
  proposalErrorCode: number | null = null;
  proposalTitleEditablePart: string;
  proposalTitleNonEditablePart: string;
  isClonedProposal = false;
  originRef: string | null = null;
  proposalRef: string;
  @ViewChild('tabs') tabs: EuiTabsComponent;
  milestoneTabSelected = false;
  legFileName: string = null;
  translatedDocs: Document[];
  tabsContext: any;

  protected readonly homeUrl = document.baseURI;

  private destroy$ = new Subject<void>();
  public activeTabIndex = 0;

  constructor(
    public asService: UxAppShellService,
    private route: ActivatedRoute,
    private router: Router,
    private proposalDetailsService: ProposalDetailsService,
    private translateService: TranslateService,
    private documentService: DocumentService,
    public breadcrumbService: EuiBreadcrumbService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.manageBreadCrumbsProposalView();

    this.route.queryParams.subscribe(({legFileName}) => {
      this.legFileName = legFileName;
    });

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
          this.documentService.setIsClonedProposal(this.isClonedProposal);
          this.originRef = proposal.cloneProposalMetadataVO?.originRef ?? null;
          this.setStateDone(proposal);
          this.translatedDocs = proposal.translatedProposals;

          this.setActiveTabIndex();

          this.tabsContext = {
            proposal: this.proposal,
            proposalState: this.proposalState,
            proposalRef: this.proposalRef,
            legFileName: this.legFileName
          };
          // Manually trigger change detection
          this.cdr.detectChanges();
        },
        error: (error) => this.setStateError(error),
      });
  }

  private setActiveTabIndex() {
    if (this.translatedDocs?.length > 0) {
      if (this.proposalRef === this.proposal.ref) {
        this.activeTabIndex = 0;
      } else {
        this.translatedDocs.forEach((doc, index) => {
          if (this.proposalRef === doc.ref) {
            this.activeTabIndex = index + 1;
          }
        });
      }
    }
  }

  ngAfterViewChecked(): void {
    if (this.tabs && !this.milestoneTabSelected && this.legFileName && this.legFileName !== null) {
      this.tabs.changeTab(1);
      this.milestoneTabSelected = true;
    }
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

  updateStateLoading(value: string) {
    if (
      value === 'loading' ||
      value === 'done' ||
      value === 'error' ||
      value === 'active'
    ) {
      this.proposalState = value;
    } else {
      this.proposalState = 'done';
    }
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
        label: this.translateService.instant('app.breadcrumb.home'),
        link: `/home`,
      },
      {
        id: 'workspace',
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

  onTabSelect(event: { tab: EuiTabComponent; index: number }) {
    if(event.index === 0) {
      this.router.navigate([`collection/${this.proposal.ref}`]);
    } else {
      this.router.navigate([`collection/${this.translatedDocs[event.index - 1].ref}`]);
    }
    this.activeTabIndex = event.index;
  }
}
