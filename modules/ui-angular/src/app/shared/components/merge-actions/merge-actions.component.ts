import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { MergeActionsService } from '@/features/akn-document/services/merge-actions.service';
import { DocumentConfig, LeosConfig, Permission } from '@/shared';
import { ContributionVO } from '@/shared/models/contribution-vo.model';
import {
  CONTRIBUTION_SELECTED,
  ContributionActionAttrValue,
  MERGE_ACTION_ATTR,
  MERGE_CONTRIBUTION,
  MergeActionVO,
} from '@/shared/models/merge-action-vo.model';
import { DocumentService } from '@/shared/services/document.service';

@Component({
  selector: 'app-merge-actions',
  styleUrls: ['./merge-actions.component.scss'],
  templateUrl: './merge-actions.component.html',
})
export class MergeActionsComponent implements OnInit, OnDestroy {
  private screenHeight: number;
  private screenWidth: number;

  private destroy$ = new Subject();
  private mouseLocation: { left: number; top: number } = { left: 0, top: 0 };

  constructor(
    private http: HttpClient,
    private doc: DocumentService,
    private ref: ChangeDetectorRef,
    private mergeActionsService: MergeActionsService,
    private ckEditorService: CKEditorService,
    private appConfigService: AppConfigService,
  ) {
    mergeActionsService.showMenu$.subscribe((data) => {
      if (data) {
        this.showMenu(data);
      }
    });
  }

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

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.actions && !this.actions.contains(event.target)) {
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
    const left =
      this.mouseLocation.left + menuWidth > this.screenWidth
        ? this.screenWidth - menuWidth
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
    this.ref.markForCheck();
  }

  canUserAcceptChanges() {
    return this.canAcceptTrackChanges;
  }

  canUserRejectChanges() {
    return this.canRejectTrackChanges;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
