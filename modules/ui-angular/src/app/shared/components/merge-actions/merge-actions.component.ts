/* eslint-disable simple-import-sort/imports */
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component, HostListener, Inject,
  Input, OnChanges,
  OnDestroy,
  OnInit, SimpleChanges
} from '@angular/core';
import {
  Subject,
  takeUntil
} from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import {
  DocumentConfig,
  LeosConfig,
  Permission
} from '@/shared';
import { DocumentService } from '@/shared/services/document.service';

import { MergeActionVO } from "@/shared/models/merge-action-vo.model";
import { ContributionVO } from "@/shared/models/contribution-vo.model";
import {
  ContributionActionAttrValue,
  ID,
  REVISION_PREFIX,
} from "@/shared/constants/fork-merge.constants";
import { DOCUMENT } from "@angular/common";
import {MergeContributionsService} from "@/features/akn-document/services/merge-contributions.service";

@Component({
  selector: 'app-merge-actions',
  styleUrls: ['./merge-actions.component.scss'],
  templateUrl: './merge-actions.component.html',
})

export class MergeActionsComponent implements OnInit, OnDestroy, OnChanges {
  documentConfig: DocumentConfig;
  leosConfig: LeosConfig;
  @Input()
  contribution: ContributionVO;

  isShown = false;
  canAcceptTrackChanges: boolean;
  canRejectTrackChanges: boolean;
  currentElement: HTMLElement;
  actions: HTMLElement;
  movedToId: string;
  movedFromId: string;

  private destroy$ = new Subject();
  private mouseLocation: { left: number; top: number } = { left: 0, top: 0 };
  private screenHeight: number;
  private screenWidth: number;

  constructor(
    private http: HttpClient,
    private doc: DocumentService,
    private ref: ChangeDetectorRef,
    private mergeContributionsService: MergeContributionsService,
    private ckEditorService: CKEditorService,
    private appConfigService: AppConfigService,
    @Inject(DOCUMENT) document: Document,
  ) {
    this.mergeContributionsService.showMenu$.subscribe((data) => {
      if (data) {
        this.showMenu(data);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.actions && !this.actions.contains(event.target)) {
      this.clickedOutside();
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.doc.permissions$.subscribe((perms) => this.setMenuState(perms));
    this.doc.documentConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        this.documentConfig = config;
      });
    this.appConfigService.config
      .pipe(takeUntil(this.destroy$))
      .subscribe((config) => {
        this.leosConfig = config;
      });
    this.mergeContributionsService.undo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((action) => {
        if (action) {
          this.undo(action.element, action.contribution);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('contribution' in changes &&
      changes.contribution.currentValue !== undefined) {
      this.mergeContributionsService.setCurrentContribution(this.contribution);
    }
  }

  setMenuState(permissions: Permission[]) {
    this.canAcceptTrackChanges =
      permissions.includes('CAN_ACCEPT_CHANGES') &&
      (!this.documentConfig?.clonedProposal ||
        (this.documentConfig?.clonedProposal &&
          this.leosConfig?.user.roles.includes('SUPPORT')));
    this.canRejectTrackChanges = permissions.includes('CAN_REJECT_CHANGES');
  }

  seeTrackChanges() {
    return this.ckEditorService.getSeeTrackChangesState();
  }

  get locationCss() {
    const menuWidth = 270;
    const left = (this.mouseLocation.left + menuWidth > this.screenWidth) ? this.screenWidth - menuWidth
      : this.mouseLocation.left;
    return {
      position: 'fixed',
      display: this.isShown ? 'block' : 'none',
      left: left + 'px',
      top: this.mouseLocation.top + 'px',
      width: menuWidth - 20 + 'px',
      zIndex: 99,
    };
  }

  clickedOutside() {
    this.isShown = false; // hide the menu
  }

  // show the menu and set the location of the mouse
  showMenu(data: {
    event: MouseEvent;
    element: HTMLElement;
    actions: HTMLElement;
  }) {
    this.isShown = true;
    this.mouseLocation = {
      left: data.event.clientX,
      top: data.event.clientY,
    };
    this.currentElement = data.element;
    this.actions = data.actions;
    this.ref.markForCheck();
  }

  canUserAcceptChanges() {
    return this.canAcceptTrackChanges;
  }

  canUserRejectChanges() {
    return this.canRejectTrackChanges;
  }

  onAccept() {
    this.mergeContributionsService.manageSelectedElements(this.currentElement, ContributionActionAttrValue.ACCEPT);
    const action: MergeActionVO = {action: "", contributionVO: undefined, elementId: "", elementState: "", elementTagName: "", withTrackChanges: false};
    action.elementId = this.currentElement.getAttribute(ID).replace(REVISION_PREFIX, '');
    action.elementState = this.mergeContributionsService.getAction(this.currentElement);
    action.action = ContributionActionAttrValue.ACCEPT;
    action.withTrackChanges = false;
    action.elementTagName = this.currentElement.tagName.toLowerCase();
    action.contributionVO = this.contribution;

    this.ckEditorService.addMergeActionList(action);
    this.isShown = false;
  }

  onAcceptWithTC() {
    this.mergeContributionsService.manageSelectedElements(this.currentElement, ContributionActionAttrValue.ACCEPT_TC);
    const action: MergeActionVO = {action: "", contributionVO: undefined, elementId: "", elementState: "", elementTagName: "", withTrackChanges: false};
    action.elementId = this.currentElement.getAttribute(ID).replace(REVISION_PREFIX, '');
    action.elementState = this.mergeContributionsService.getAction(this.currentElement);
    action.action = ContributionActionAttrValue.ACCEPT_TC;
    action.withTrackChanges = true;
    action.elementTagName = this.currentElement.tagName.toLowerCase();
    action.contributionVO = this.contribution;

    this.ckEditorService.addMergeActionList(action);
    this.isShown = false;
  }

  onMarkProcessed() {
    this.mergeContributionsService.manageSelectedElements(this.currentElement, ContributionActionAttrValue.PROCESSED);
    const action: MergeActionVO = {action: "", contributionVO: undefined, elementId: "", elementState: "", elementTagName: "", withTrackChanges: false};
    action.elementId = this.currentElement.getAttribute(ID).replace(REVISION_PREFIX, '');
    action.elementState = this.mergeContributionsService.getAction(this.currentElement);
    action.action = ContributionActionAttrValue.PROCESSED;
    action.withTrackChanges = true;
    action.elementTagName = this.currentElement.tagName.toLowerCase();
    action.contributionVO = this.contribution;

    this.ckEditorService.addMergeActionList(action);
    this.isShown = false;
  }

  public undo(element: HTMLElement, contribution: ContributionVO) {
    this.mergeContributionsService.manageSelectedElements(element, ContributionActionAttrValue.UNDO);
    const action: MergeActionVO = {action: "", contributionVO: undefined, elementId: "", elementState: "", elementTagName: "", withTrackChanges: false};
    action.elementId = element.getAttribute(ID).replace(REVISION_PREFIX, '');
    action.elementState = this.mergeContributionsService.getAction(element);
    action.action = ContributionActionAttrValue.UNDO;
    action.withTrackChanges = false;
    action.elementTagName = element.tagName.toLowerCase();
    action.contributionVO = contribution;

    this.ckEditorService.addMergeActionList(action);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
