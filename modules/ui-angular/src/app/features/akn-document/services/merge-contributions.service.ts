import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, filter, map, Observable, switchMap, tap } from 'rxjs';

import { MergeActionsService } from '@/features/akn-document/services/merge-actions.service';
import {
  PageMode,
  PageModeService,
} from '@/features/akn-document/services/page-mode.service';
import { SyncDocumentScrollService } from '@/features/akn-document/services/sync-document-scroll.service';
import { ContributionStatus } from '@/shared';
import { ContributionVO } from '@/shared/models/contribution-vo.model';
import { DocumentViewResponse } from '@/shared/models/document-view-response.model';
import {
  CONTRIBUTION_SELECTED,
  ContributionActionAttrValue,
  MERGE_ACTION_ATTR,
  MergeActionVO,
} from '@/shared/models/merge-action-vo.model';
import { DocumentService } from '@/shared/services/document.service';
import { parentHasClass } from '@/shared/utils/dom';

import { apiBaseUrl } from '../../../../config';

const compareClasses = [
  'leos-content-removed',
  'leos-content-removed-cn',
  'leos-content-new',
  'leos-content-new-cn',
  'leos-double-compare-removed',
  'leos-double-compare-added',
];

@Injectable({
  providedIn: 'root',
})
export class MergeContributionsService {
  contributions$: Observable<ContributionVO[]>;
  contributionModeEnabled$: Observable<boolean>;
  contributionSelections$: Observable<number>;
  contributionViewAndMerge$: Observable<any>;
  contributionViewAndMergeCollapsed$: Observable<boolean>;
  processed$: Observable<[boolean, ContributionVO]>;
  isContributionDeclinedOrProcessed$: Observable<boolean>;
  hasNextChangeDisabled$: Observable<boolean>;
  hasPrevChangesDisabled$: Observable<boolean>;
  contributionChanges$: Observable<HTMLElement[]>;

  contributionIndex = 0;

  private currentElement: HTMLElement;
  private actions: HTMLElement;

  private documentType: string;
  private documentRef: string;

  private contributionSelectionsBS = new BehaviorSubject<number>(0);
  private contributionViewAndMergeCollapsedBS = new BehaviorSubject<boolean>(
    true,
  );
  private contributionModeEnabledBS = new BehaviorSubject(false);
  private contributionsBS = new BehaviorSubject<ContributionVO[]>([]);

  private processedBS = new BehaviorSubject<[boolean, ContributionVO]>([
    false,
    undefined,
  ]);
  private contributionViewAndMergeBS = new BehaviorSubject<
    [DocumentViewResponse, ContributionVO]
  >(null);
  private isContributionDeclinedOrProcessedBS = new BehaviorSubject<boolean>(
    false,
  );
  private hasNextChangeDisabledBS = new BehaviorSubject<boolean>(true);
  private hasPrevChangesDisabledBS = new BehaviorSubject<boolean>(true);
  private contributionChangesBS = new BehaviorSubject<HTMLElement[]>([]);

  constructor(
    private mergeActionsService: MergeActionsService,
    private http: HttpClient,
    private pageModeService: PageModeService,
    private translate: TranslateService,
    private appShell: UxAppShellService,
    private documentService: DocumentService,
    private syncScrollService: SyncDocumentScrollService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.hasNextChangeDisabled$ = this.hasNextChangeDisabledBS.asObservable();
    this.hasPrevChangesDisabled$ = this.hasPrevChangesDisabledBS.asObservable();
    this.contributions$ = this.contributionsBS.asObservable();
    this.contributionModeEnabled$ =
      this.contributionModeEnabledBS.asObservable();
    this.processed$ = this.processedBS.asObservable();
    this.contributionSelections$ = this.contributionSelectionsBS.asObservable();
    this.isContributionDeclinedOrProcessed$ =
      this.isContributionDeclinedOrProcessedBS.asObservable();
    this.contributionViewAndMerge$ = this.contributionViewAndMergeBS.pipe(
      filter(Boolean),
    );
    this.contributionChanges$ = this.contributionChangesBS.asObservable();

    this.contributionModeEnabledBS.pipe(
      tap((enabled) => {
        if (enabled) {
          this.pageModeService.setPageMode(PageMode.Contribution);
          this.syncScrollService.setSyncScroll(true);
        } else this.clearContributionMerge();
      }),
    );

    this.mergeActionsService.showMenu$.subscribe((data) => {
      if (data) {
        this.setMergeState(data);
      }
    });

    this.documentService.documentRefAndCategory$
      .pipe(
        filter((documentOptions) => documentOptions.category !== 'coverpage'),
        map((docOptions) => {
          this.documentRef = docOptions.ref;
          this.documentType = docOptions.category;
          this.getContributions();
        }),
      )
      .subscribe();
  }

  toggleSyncScroll() {
    const current = this.syncScrollService.isSyncScrollEnabled;
    this.syncScrollService.setSyncScroll(!current);
  }

  closeContributionMergeView() {
    this.documentService.resetZoomValues();
    this.contributionViewAndMergeBS.next(null);
    this.syncScrollService.setSyncScroll(false);
    this.pageModeService.setPageMode(PageMode.Normal);
  }

  toggleContributionMode() {
    const nextValue = !this.contributionModeEnabledBS.value;
    this.contributionModeEnabledBS.next(nextValue);
    if (nextValue) {
      this.pageModeService.setPageMode(PageMode.Contribution);
    } else {
      this.clearContributionMerge();
    }
  }

  clearContributionMerge() {
    this.pageModeService.setPageMode(PageMode.Normal);
    this.syncScrollService.setSyncScroll(false);
  }

  handleContributionSelectCount(selected: boolean, reset?: boolean) {
    if (reset) {
      this.contributionSelectionsBS.next(0);
    } else if (selected) {
      this.contributionSelectionsBS.next(
        this.contributionSelectionsBS.value + 1,
      );
    } else {
      if (this.contributionSelectionsBS.value - 1 >= 0) {
        this.contributionSelectionsBS.next(
          this.contributionSelectionsBS.value - 1,
        );
      } else {
        this.contributionSelectionsBS.next(0);
      }
    }
  }

  setContributionViewAndMergeCollapsed(collapsed: boolean) {
    this.contributionViewAndMergeCollapsedBS.next(collapsed);
  }

  markContributionAsProcessed(contribution: ContributionVO) {
    const contributionVersionRef = contribution.versionedReference;
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;

    return this.http.post(
      `${apiBaseUrl}/secured/contribution/mark-as-processed/${contributionVersionRef}/${documentType}`,
      {},
    );
  }

  setIsContributionDeclinedOrProcessed(declined: boolean) {
    this.isContributionDeclinedOrProcessedBS.next(declined);
  }

  toggleIsContributionDeclinedOrProcessed() {
    this.isContributionDeclinedOrProcessedBS.next(
      !this.isContributionDeclinedOrProcessedBS.value,
    );
  }

  getContributions() {
    const documentRef = this.documentRef;
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;
    const queryString = `?annexIndex=${this.documentService.annexDocNumber}`;
    return this.http
      .get<ContributionVO[]>(
        `${apiBaseUrl}/secured/contribution/list-contributions/${documentRef}/${documentType}${queryString}`,
      )
      .subscribe((contributions) => {
        const contributionsAfterGreyedOut =
          this.greyContributions(contributions);
        this.contributionsBS.next(contributionsAfterGreyedOut);
      });
  }

  handleNextChangeContribution() {
    if (
      this.contributionIndex !==
      this.contributionChangesBS.value.length - 1
    ) {
      const nextChange = this.contributionIndex + 1;
      this.contributionChangesBS.value[nextChange]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
      this.contributionIndex++;
      console.log(this.contributionIndex);
    }
    this.checkHandleNavCompareBtnDisabled();
  }

  handlePrevChangeContribution() {
    if (this.contributionIndex > 0) {
      {
        const prevChange = this.contributionIndex - 1;
        this.contributionChangesBS.value[prevChange]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
        this.contributionIndex--;
        console.log(this.contributionIndex);
      }
    }
    this.checkHandleNavCompareBtnDisabled();
  }

  updateContributionChanges(newValues: HTMLElement[]) {
    this.contributionChangesBS.next(newValues);
  }

  public checkHandleNavCompareBtnDisabled() {
    this.hasNextChangeDisabledBS.next(
      this.contributionIndex === this.contributionChangesBS.value.length - 1,
    );
    this.hasPrevChangesDisabledBS.next(this.contributionIndex === 0);
  }

  mergeContributions(
    mergeActions: MergeActionVO[],
    acceptAllContributions: boolean,
  ) {
    const documentRef = this.documentRef;
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;

    this.http
      .post(
        `${apiBaseUrl}/secured/contribution/merge-contributions/${documentRef}/${documentType}`,
        {
          mergeActions,
          acceptAllContributions,
        },
        { responseType: 'text' as 'json' },
      )
      .subscribe({
        next: () => {
          this.appShell.growl({
            severity: 'success',
            summary: this.translate.instant(
              'global.notifications.title.success',
            ),
            detail: this.translate.instant(
              'page.editor.contribution.merge-contribution-message-success',
            ),
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
          this.handleContributionUI();
          if (!acceptAllContributions)
            this.updateProcessedStatus(false, mergeActions[0].contributionVO);
          this.documentService.reloadDocument();
          this.getContributions();
        },
        error: (res) => {
          this.appShell.growl({
            severity: 'danger',
            summary: this.translate.instant(
              'page.editor.contribution.merge-contribution-message-error',
            ),
            detail: res,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
      });
  }

  updateProcessedStatus(process: boolean, contribution: ContributionVO) {
    this.processedBS.next([process, contribution]);
  }

  declineContribution(contribution: ContributionVO) {
    const documentRef = contribution.versionedReference;
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;
    const versionLabel = `${contribution.versionNumber.major}.${contribution.versionNumber.intermediate}.${contribution.versionNumber.minor}`;

    return this.http
      .post<{ contributionStatus: string }>(
        `${apiBaseUrl}/secured/contribution/decline-contributions/${documentRef}/${documentType}`,
        {},
        { params: { versionLabel } },
      )
      .subscribe({
        next: () => {
          this.appShell.growl({
            severity: 'success',
            summary: this.translate.instant(
              'global.notifications.title.success',
            ),
            detail: this.translate.instant(
              'page.editor.contribution.decline-contribution-message-success',
            ),
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
          this.setIsContributionDeclinedOrProcessed(true);
          this.contributionSelectionsBS.next(0);
          this.getContributions();
        },
        error: (res) => {
          this.appShell.growl({
            severity: 'danger',
            summary: this.translate.instant(
              'page.editor.contribution.decline-contribution-message-error',
            ),
            detail: res,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
      });
  }

  contributionMergeOnAccept() {
    this.currentElement.classList.add(CONTRIBUTION_SELECTED);
    this.currentElement.setAttribute(
      MERGE_ACTION_ATTR,
      ContributionActionAttrValue.ACCEPT,
    );
    const action: MergeActionVO = {
      action: '',
      contributionVO: undefined,
      elementId: '',
      elementState: '',
      elementTagName: '',
      withTrackChanges: false,
    };
    action.elementId = this.currentElement
      .getAttribute('id')
      .replace('revision-', '');
    action.elementState = this.mergeActionsService.getAction(
      this.currentElement,
    );
    action.action = ContributionActionAttrValue.ACCEPT;
    action.withTrackChanges = false;
    action.elementTagName = this.currentElement.tagName.toLowerCase();
    // action.contributionVO = this.contribution;

    this.mergeActionsService.addMergeActionList(action);
  }

  contributionMergeOnAcceptWithTC() {
    this.currentElement.classList.add(CONTRIBUTION_SELECTED);
    this.currentElement.setAttribute(
      MERGE_ACTION_ATTR,
      ContributionActionAttrValue.ACCEPT_TC,
    );
    const action: MergeActionVO = {
      action: '',
      contributionVO: undefined,
      elementId: '',
      elementState: '',
      elementTagName: '',
      withTrackChanges: false,
    };
    action.elementId = this.currentElement
      .getAttribute('id')
      .replace('revision-', '');
    action.elementState = this.mergeActionsService.getAction(
      this.currentElement,
    );
    action.action = ContributionActionAttrValue.ACCEPT_TC;
    action.withTrackChanges = true;
    action.elementTagName = this.currentElement.tagName.toLowerCase();
    // action.contributionVO = this.contribution;

    this.mergeActionsService.addMergeActionList(action);
  }

  onMarkProcessed() {
    this.currentElement.classList.add(CONTRIBUTION_SELECTED);
    this.currentElement.setAttribute(
      MERGE_ACTION_ATTR,
      ContributionActionAttrValue.PROCESSED,
    );
    const action: MergeActionVO = {
      action: '',
      contributionVO: undefined,
      elementId: '',
      elementState: '',
      elementTagName: '',
      withTrackChanges: false,
    };
    action.elementId = this.currentElement
      .getAttribute('id')
      .replace('revision-', '');
    action.elementState = this.mergeActionsService.getAction(
      this.currentElement,
    );
    action.action = ContributionActionAttrValue.PROCESSED;
    action.withTrackChanges = true;
    action.elementTagName = this.currentElement.tagName.toLowerCase();
    // action.contributionVO = this.contribution;

    this.mergeActionsService.addMergeActionList(action);
  }

  viewAndMergeContribution(contribution: ContributionVO) {
    this.contributionModeEnabledBS.next(true);
    this.pageModeService.setPageMode(PageMode.Contribution);
    this.syncScrollService.setSyncScroll(true);
    this.handleContributionSelectCount(false, true);
    this.fetchDocumentViewForContribution(contribution).subscribe({
      next: (res) => {
        this.contributionViewAndMergeBS.next([res, contribution]);
      },
      error: (res) => {
        this.appShell.growl({
          severity: 'danger',
          summary: this.translate.instant(
            'page.editor.contribution.view-contribution-message-error',
          ),
          detail: res,
          life: 3000,
          isGrowlSticky: false,
          position: 'bottom-right',
        });
      },
    });
  }

  private fetchDocumentViewForContribution(contribution: ContributionVO) {
    const contributionVersionRef = contribution.versionedReference;
    const legFileName = contribution.legFileName;
    const documentRef = this.documentRef;
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;
    return this.http.get<DocumentViewResponse>(
      `${apiBaseUrl}/secured/contribution/view-merge-pane/${documentRef}/${documentType}?contributionVersionRef=${contributionVersionRef}&legFileName=${legFileName}`,
      {},
    );
  }

  private handleContributionUI() {
    const changes = this.document.querySelectorAll(
      '.selected-contribution-wrapper',
    );
    if (changes.length > 0) {
      changes.forEach((item) => {
        if (!item.classList.contains('contribution-wrapper-after-merge')) {
          item.classList.add('contribution-wrapper-after-merge');

          for (const child of item.children) {
            if (child.classList.contains('merge-actions-wrapper')) {
              for (const innerChild of child.children) {
                if (innerChild.classList.contains('accept')) {
                  innerChild.setAttribute(
                    'title',
                    this.translate.instant(
                      'page.editor.contribution.view.merge-contributions.accepted-change',
                    ),
                  );
                }
                if (innerChild.classList.contains('reject')) {
                  innerChild.setAttribute(
                    'title',
                    this.translate.instant(
                      'page.editor.contribution.view.merge-contributions.rejected-change',
                    ),
                  );
                }
              }
            }
          }
        }
      });
    } else {
      this.document
        .querySelectorAll('contribution-wrapper-after-merge')
        .forEach((item) => {
          item.classList.remove('contribution-wrapper-after-merge');
        });
    }
  }

  private setMergeState(data: {
    event: MouseEvent;
    element: HTMLElement;
    actions: HTMLElement;
  }) {
    this.currentElement = data.element;
    this.actions = data.actions;
    this.mergeActionsService.getAction(this.currentElement);
  }

  private greyContributions(contributions: ContributionVO[]) {
    return contributions.map((c) => {
      if (c.contributionStatus === ContributionStatus.ContributionDone) {
        c.greyed = true;
      } else {
        c.greyed = false;
      }
      return c;
    });
  }
}
