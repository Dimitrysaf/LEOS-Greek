import {TemplatePortal} from "@angular/cdk/portal";
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {EuiDialogConfig, EuiDialogService} from "@eui/components/eui-dialog";
import { EuiAppShellService, EuiGrowlService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import {BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable, Subject, tap} from 'rxjs';

import {
  PageMode,
  PageModeService,
} from '@/features/akn-document/services/page-mode.service';
import { SyncDocumentScrollService } from '@/features/akn-document/services/sync-document-scroll.service';
import { ContributionStatus } from '@/shared';
import { ContributionVO } from '@/shared/models/contribution-vo.model';
import { DocumentViewResponse } from '@/shared/models/document-view-response.model';
import {MergeActionItem, MergeActionVO} from '@/shared/models/merge-action-vo.model';
import {DocumentService} from '@/shared/services/document.service';

import { apiBaseUrl } from '../../../../config';
import {
  ADD_ATTR, CONTENT_CHANGE, ContributionActionAttrValue,
  DELETE_ATTR,
  ID, INSERT_ATTR,
  LEOS_SOFT_ACTION,
  LEOS_TRACK_ACTION, MERGE_CONTRIBUTION,
  MOVE_ATTR,
  MOVE_FROM_ATTR, MOVE_PREFIX,
  MOVE_TO_ATTR,
  PARENT_AFFECTED,
  REVISION_PREFIX, SELECTED_ACTION_ATTR
} from "@/shared/constants/fork-merge.constants";
import {MergeContributionResponse} from "@/shared/models/merge-contribution-response.model";
import {ZoombarService} from "@/shared/services/zoombar.service";

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
  feedbackToBeSent$: Observable<boolean>;
  disableSendFeedbackToBeSent$: Observable<boolean>;
  hasNextChangeDisabled$: Observable<boolean>;
  hasPrevChangesDisabled$: Observable<boolean>;
  contributionSelected$: Observable<boolean>;
  contributionChanges$: Observable<HTMLElement[]>;
  showMenu$: Observable<{event: MouseEvent, element: HTMLElement, actions: HTMLElement}>;
  undo$: Observable<{element: HTMLElement, contribution: ContributionVO}>;

  contributionIndex = 0;

  private mergeActionList: MergeActionVO[] = [];
  private showMenuBS = new Subject<{event: MouseEvent, element: HTMLElement, actions: HTMLElement}>();
  private feedbackToBeSentBS = new BehaviorSubject<boolean>(false);
  private disableSendFeedbackToBeSentBS = new BehaviorSubject<boolean>(true);

  private documentType: string;
  private documentRef: string;

  private contribution: ContributionVO;

  private undoBS = new BehaviorSubject<{element: HTMLElement, contribution: ContributionVO}>(null);
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
  private contributionSelectionsBS = new BehaviorSubject<number>(0);
  private contributionSelectedBS = new BehaviorSubject<boolean>(false);

  public HIGHER_ELTS = ['chapter' , 'akntitle', 'section', 'part'];

  constructor(
    private http: HttpClient,
    private pageModeService: PageModeService,
    private translate: TranslateService,
    private appShell: EuiGrowlService,
    private documentService: DocumentService,
    private syncScrollService: SyncDocumentScrollService,
    private dialogService: EuiDialogService,
    private zoombarService: ZoombarService,
    private translateService: TranslateService,
    private growlService: EuiGrowlService,
    protected domSanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.undo$ = this.undoBS.asObservable();
    this.showMenu$ = this.showMenuBS.asObservable();
    this.hasNextChangeDisabled$ = this.hasNextChangeDisabledBS.asObservable();
    this.hasPrevChangesDisabled$ = this.hasPrevChangesDisabledBS.asObservable();
    this.contributions$ = this.contributionsBS.asObservable();
    this.contributionModeEnabled$ =
      this.contributionModeEnabledBS.asObservable();
    this.processed$ = this.processedBS.asObservable();
    this.contributionSelections$ = this.contributionSelectionsBS.asObservable();
    this.contributionSelected$ = this.contributionSelectedBS.asObservable();
    this.isContributionDeclinedOrProcessed$ =
      this.isContributionDeclinedOrProcessedBS.asObservable();
    this.contributionViewAndMerge$ = this.contributionViewAndMergeBS.pipe(
      filter(Boolean),
    );
    this.contributionChanges$ = this.contributionChangesBS.asObservable();
    this.feedbackToBeSent$ = this.feedbackToBeSentBS.asObservable();
    this.disableSendFeedbackToBeSent$ = this.disableSendFeedbackToBeSentBS.asObservable();

    this.contributionModeEnabledBS.pipe(
      tap((enabled) => {
        if (enabled) {
          this.pageModeService.setPageMode(PageMode.Contribution);
          this.syncScrollService.setSyncScroll(true);
        } else this.clearContributionMerge();
      }),
    );

    combineLatest(
      [this.documentService.documentConfig$,
      this.documentService.documentRefAndCategory$]
    ).pipe(
        distinctUntilChanged(),
        filter(([config, documentOptions]) => documentOptions.category !== 'coverpage'),
        map(([config, docOptions]) => {
          this.documentRef = docOptions.ref;
          this.documentType = docOptions.category;
          this.documentService.annexDocNumber =
            config.documentsMetadata
              .filter((d) => d.category === 'ANNEX')
              .findIndex((d) => d.ref === this.documentRef) + 1;
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
    this.zoombarService.resetAllZoomLevels();
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

  setStatusFeedbackToBeSent(disabled: boolean) {
    this.disableSendFeedbackToBeSentBS.next(disabled);
  }

  setFeedbackToBeSent(value: boolean) {
    this.feedbackToBeSentBS.next(value);
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
    this.contributionSelectedBS.next(this.contributionSelectionsBS.value === 0);
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

  getCurrentContribution() {
    return this.contribution;
  }

  setCurrentContribution(contribution: ContributionVO) {
    this.contribution = contribution;
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
        this.countFeedbacks(contributions);
      });
  }

  countFeedbacks(contributions: ContributionVO[]) {
    if (contributions && contributions.length > 0) {
      for (const contribution of contributions) {
        if (!contribution.greyed) {
          const legFileName = contribution.legFileName;
          const proposalRef = contribution.proposalRef;
          const versionedReference = contribution.versionedReference;
          return this.http
            .get<number>(
              `${apiBaseUrl}/secured/contribution/${legFileName}/${proposalRef}/count-feedbacks/${versionedReference}`,
            )
            .subscribe((nbFeedbacks) => {
              if (nbFeedbacks > 0) {
                this.setFeedbackToBeSent(true);
              }
            });
        }
      }
    }
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
    const contribution = mergeActions.length > 0 ? mergeActions[0].contributionVO : null;
    const documentRef = this.documentRef;
    const documentType =
      this.documentType === 'coverpage' ? 'coverPage' : this.documentType;

    this.http
      .post<MergeContributionResponse>(
        `${apiBaseUrl}/secured/contribution/merge-contributions/${documentRef}/${documentType}`,
        {
          mergeActions,
          acceptAllContributions,
        },
      ).subscribe({
        next: (resp) => {
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
          if (!acceptAllContributions && contribution)
            this.updateProcessedStatus(false, contribution);
          this.emptyMergeActionList();
          this.documentService.reloadDocument();
          if (!resp.mergeStatus) {
            this.dialogService.openDialog(
              new EuiDialogConfig({
                title: this.translateService.instant(
                  'page.editor.actions-merge-contributions.title',
                ),
                content: this.translateService.instant(
                  'page.editor.actions-merge-contributions.content',
                ),
                acceptLabel: this.translateService.instant('global.actions.continue'),
                hasDismissButton: false,
                accept: () => {
                },
              }),
            );
          }
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
          this.emptyMergeActionList();
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
          this.contributionSelectedBS.next(true);
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

  onClickMarkAsProcessed() {
    this.toggleIsContributionDeclinedOrProcessed();
    this.openMarkContributionAsProcessedDialog();
  }

  onCancelMarkContributionAsProcessed() {
    this.toggleIsContributionDeclinedOrProcessed();
  }

  onAcceptMarkContributionAsProcessed() {
    this
      .markContributionAsProcessed(this.contribution)
      .subscribe({
        next: (res) => {
          this.growlService.growl({
            severity: 'success',
            summary: this.translate.instant(
              'global.notifications.title.success',
            ),
            detail: this.translate.instant(
              'page.editor.contribution.mark-as-processed-message-success',
            ),
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
          this.getContributions();
          this.setIsContributionDeclinedOrProcessed(
            true,
          );
          this.updateProcessedStatus(
            true,
            this.contribution,
          );
        },
        error: (res) => {
          this.growlService.growl({
            severity: 'danger',
            summary: this.translate.instant(
              'page.editor.contribution.mark-as-processed-message-error',
            ),
            detail: res,
            life: 3000,
            isGrowlSticky: false,
            position: 'bottom-right',
          });
        },
      });
  }

  viewAndMergeContribution(contribution: ContributionVO) {
    this.contributionModeEnabledBS.next(true);
    this.pageModeService.setPageMode(PageMode.Contribution);
    this.syncScrollService.setSyncScroll(true);
    this.handleContributionSelectCount(false, true);
    this.fetchDocumentViewForContribution(contribution).subscribe({
      next: (res) => {
        this.contribution = contribution;
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

  openMarkContributionAsProcessedDialog() {
    const content = this.translate.instant(
      `page.editor.contribution.view.mark-contribution-as-processed.modal-text`,
    );
    const conteSanitized = this.domSanitizer.bypassSecurityTrustHtml(content);

    this.dialogService.openDialog({
      title: this.translate.instant(
        'page.editor.contribution.view.mark-contribution-as-processed.modal-title',
      ),
      content: conteSanitized as TemplatePortal,
      acceptLabel: this.translate.instant('global.actions.continue'),
      dismissLabel: this.translate.instant('global.actions.cancel'),
      accept: () => {
        this.onAcceptMarkContributionAsProcessed();
      },
      dismiss: () => {
        this.onCancelMarkContributionAsProcessed();
      },
    });
  }

  onClickSendFeedback() {
    this.dialogService.openDialog({
      title: this.translate.instant(
        'page.editor.contribution.actions.view.and.merge.actions.send.feedback',
      ),
      content: this.translate.instant(
        'page.editor.contribution.actions.view.and.merge.actions.send.feedback.confirmation',
      ),
      acceptLabel: this.translate.instant('global.actions.continue'),
      accept: () => {
        this.sendFeedback();
      },
      dismiss: () => {},
    });
  }

  public getMergeActionList():MergeActionItem[] {
    return this.mergeActionList;
  }

  public addMergeActionList(action: MergeActionVO) {
    this.mergeActionList.push(action);
  }

  public removeMergeActionList(element: HTMLElement): MergeActionVO {
    const removedAction = this.mergeActionList.find((action) => action.elementId === element.getAttribute(ID).replace(REVISION_PREFIX, ''));
    this.mergeActionList = this.mergeActionList.filter((action) => action.elementId !== element.getAttribute(ID).replace(REVISION_PREFIX, ''));
    return removedAction;
  }

  public emptyMergeActionList() {
    this.mergeActionList = [];
  }

  public getAction(elt: HTMLElement) {
    let elementState;
    const action = elt.getAttribute(LEOS_TRACK_ACTION);
    const softAction = elt.getAttribute(LEOS_SOFT_ACTION);
    const parentAffected = elt.getAttribute(PARENT_AFFECTED);
    if (softAction && (softAction === MOVE_FROM_ATTR || softAction === MOVE_TO_ATTR)) {
      elementState = MOVE_ATTR;
    } else if (action === DELETE_ATTR) {
      elementState = DELETE_ATTR;
    } else if (action === INSERT_ATTR) {
      elementState = ADD_ATTR;
    } else if (parentAffected) {
      elementState = CONTENT_CHANGE;
    }
    return elementState;
  }

  public showMenu(event: MouseEvent, element: HTMLElement, actions: HTMLElement) {
    this.showMenuBS.next({event, element, actions});
  }

  public manageSelectedElements(element: HTMLElement, contributionActionAttrValue: ContributionActionAttrValue) {
    const elementState = this.getAction(element);
    if (elementState === MOVE_ATTR) {
      if (element.getAttribute(ID).includes(MOVE_PREFIX)) {
        const movedFromElement = document.getElementById(element.getAttribute(ID).replace(MOVE_PREFIX, ''));
        movedFromElement.setAttribute(SELECTED_ACTION_ATTR, contributionActionAttrValue);
        const temp_list = this.getImpactedElements(movedFromElement);
        temp_list.forEach(e => {
          const elt =  e as HTMLElement;
          elt.setAttribute(SELECTED_ACTION_ATTR, contributionActionAttrValue);
        });
      } else {
        const movedToElement = document.getElementById(REVISION_PREFIX + MOVE_PREFIX + element.getAttribute(ID).replace(REVISION_PREFIX, ''));
        movedToElement.setAttribute(SELECTED_ACTION_ATTR, contributionActionAttrValue);
      }
    }
    element.setAttribute(SELECTED_ACTION_ATTR, contributionActionAttrValue);
    const list = this.getImpactedElements(element);
    list.forEach(e => {
      const elt =  e as HTMLElement;
      elt.setAttribute(SELECTED_ACTION_ATTR, contributionActionAttrValue);
    });
  }

  public getImpactedElements(element: HTMLElement): NodeList {
    if (this.HIGHER_ELTS.includes(element.tagName.toLowerCase())) {
      return element.querySelectorAll('num.' + MERGE_CONTRIBUTION + ',heading.' + MERGE_CONTRIBUTION);
    } else {
      return element.querySelectorAll('.' + MERGE_CONTRIBUTION);
    }
  }

  public getImpactedElementsForUndo(element: HTMLElement): NodeList {
    return element.querySelectorAll('[leos\\:mergeAction]');
  }

  public undo(element: HTMLElement, contribution: ContributionVO) {
    this.undoBS.next({element, contribution});
  }

  private sendFeedback() {
    this.http
      .post(`${apiBaseUrl}/secured/contribution/milestones/sendFeedback`, {
        documentRef: this.documentRef,
        proposalRef: this.contribution.proposalRef,
        legFileName: this.contribution.legFileName,
        contributionsVersionRef: this.contribution.versionedReference
      })
      .subscribe(() => {
        this.appShell.growl({
          severity: 'success',
          summary: this.translate.instant('global.notifications.title.success'),
          detail: this.translate.instant(
            'page.editor.contribution.actions.view.and.merge.actions.send.feedback.success',
          ),
          life: 3000,
          isGrowlSticky: false,
          position: 'bottom-right',
        });
        this.setFeedbackToBeSent(false);
        this.documentService.refreshAnnotate();
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

  private greyContributions(contributions: ContributionVO[]) {
    return contributions.map((c) => {
      c.greyed = c.contributionStatus === ContributionStatus.ContributionDone;
      return c;
    });
  }

}
