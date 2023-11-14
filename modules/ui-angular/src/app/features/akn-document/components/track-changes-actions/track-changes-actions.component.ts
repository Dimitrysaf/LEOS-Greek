import {
  ChangeDetectorRef,
  Component,
  Input, OnDestroy,
  OnInit,
} from "@angular/core";
import {TrackChangeAction, TrackChangesActionsService} from "@/features/akn-document/services/track-changes-actions.service";
import {DocumentService} from "@/shared/services/document.service";
import {DocumentConfig, LeosConfig, Permission} from "@/shared";
import {Subject, takeUntil} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {CKEditorService} from "@/features/akn-document/services/ckeditor.service";
import {AppConfigService} from "@/core/services/app-config.service";
import {appConfig} from "../../../../../config";

@Component({
  selector:'app-track-changes-actions',
  styleUrls:['./track-changes-actions.component.scss'],
  host:{
    '(document:click)':'clickedOutside()',
    '(document:keydown)':'clickedOutside()',
  },
  templateUrl: './track-changes-actions.component.html'
})
export class TrackChangesActionsComponent implements OnInit, OnDestroy {
  documentConfig: DocumentConfig;
  leosConfig: LeosConfig;

  isShown = false;
  trackChangesDr: NodeListOf<Element>;
  canAcceptTrackChanges: boolean;
  canRejectTrackChanges: boolean;
  currentElement: HTMLElement;
  trackChangeAction: TrackChangeAction;
  movedToId : string;
  movedFromId: string;

  private destroy$ = new Subject();

  private mouseLocation :{left:number,top:number} = {left:0, top:0};

  constructor(private http: HttpClient, private doc: DocumentService, private ref: ChangeDetectorRef, private trackChangesActionsService:TrackChangesActionsService, private ckEditorService: CKEditorService, private appConfigService: AppConfigService){
    trackChangesActionsService.show.subscribe(trackChanges => {
      this.trackChangesDr = trackChanges.trackChanges;
      this.addTrackChangesEvents();
    });
  }

  ngOnInit() {
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
    this.canAcceptTrackChanges = permissions.includes('CAN_ACCEPT_CHANGES') &&
      (!this.documentConfig?.clonedProposal || (this.documentConfig?.clonedProposal && this.leosConfig?.user.roles.includes("SUPPORT")));
    this.canRejectTrackChanges = permissions.includes('CAN_REJECT_CHANGES');
  }

  seeTrackChanges() {
    return this.ckEditorService.getSeeTrackChangesState();
  }

  addTrackChangesEvents() {
    this.trackChangesDr?.forEach(tc => {
      tc.addEventListener("contextmenu", e => {
        if (this.seeTrackChanges()) {
          e.preventDefault();
          this.showMenu(e);
        }
      })
    });
  }

  get locationCss() {
    return {
      'position': 'fixed',
      'display': this.isShown ? 'block':'none',
      left: this.mouseLocation.left + 'px',
      top: this.mouseLocation.top + 'px',
    };
  }

  clickedOutside() {
    this.isShown = false; // hide the menu
  }

  // show the menu and set the location of the mouse
  showMenu(event) {
    this.isShown = true;
    this.currentElement = event.currentTarget;
    this.mouseLocation = {
      left: event.clientX,
      top: event.clientY
    }
    this.getAction(event.currentTarget);
    this.ref.markForCheck();
  }

  getAction(elt: HTMLElement) {
    let action = elt.getAttribute('leos:action');
    this.movedToId = elt.getAttribute('leos:softmove_to');
    this.movedFromId = elt.getAttribute('leos:softmove_from');
    if (action == 'insert') {
      this.trackChangeAction = TrackChangeAction.ADD;
    } else if (action == 'delete') {
      this.trackChangeAction = TrackChangeAction.DEL;
    }
    if (!!this.movedToId) {
      this.trackChangeAction = TrackChangeAction.MOVED_TO;
    }
    if (!!this.movedFromId) {
      this.trackChangeAction = TrackChangeAction.MOVED_FROM;
    }
  }

  canUserAcceptChanges() {
    return this.canAcceptTrackChanges;
  }

  canUserRejectChanges() {
    return this.canRejectTrackChanges;
  }

  onAccept() {
    this.trackChangesActionsService.applyTrackChangeAction(this.trackChangeAction,
      {elementType: this.currentElement.tagName.toLowerCase(), elementId: this.currentElement.id},
      this.doc);
  }

  onReject() {
    this.trackChangesActionsService.rejectTrackChangeAction(this.trackChangeAction,
      {elementType: this.currentElement.tagName.toLowerCase(), elementId: this.currentElement.id},
      this.doc);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
