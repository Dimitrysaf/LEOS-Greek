import {
  Component,
  ElementRef,
  EventEmitter, Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EuiDialogComponent } from '@eui/components/eui-dialog';
import { consumeEvent } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';

import { Version } from '@/features/akn-document/models/versions';
import { DocumentService } from '@/shared/services/document.service';
import { AppConfigService } from '@/core/services/app-config.service';
import { VersionsPaneGroupComponent } from '@/features/akn-document/components/versions-pane-group/versions-pane-group.component';

import { ViewVersionService } from '../../services/view-version.service';
import {of} from "rxjs";
import {EuiMessageBoxComponent} from "@eui/components/eui-message-box";
import {DOCUMENT_ACTIONS_SERVICE} from "@/features/akn-document/akn-document.module";
import {DocumentActionsService} from "@/features/akn-document/services/document-actions.service";

@Component({
  selector: 'app-version-actions-dropdown',
  templateUrl: './version-actions-dropdown.component.html',
  styleUrls: ['./version-actions-dropdown.component.scss'],
})
export class VersionActionsDropdownComponent implements OnInit, OnDestroy {
  @Input() version: Version;
  @Input() isMilestone?: boolean;
  @Input() versionsPaneGroupComponent!: VersionsPaneGroupComponent;
  @Output() exploreMilestone = new EventEmitter<Version>();
  @ViewChild('versionRevertDialog') versionRevertDialog: EuiDialogComponent;
  @ViewChild('versionArchiveDialog') versionArchiveDialog: EuiDialogComponent;
  @ViewChild('versionAlreadyMessage') versionAlreadyMessage : EuiMessageBoxComponent;
  disabled: boolean;
  canArchiveVersion: boolean;
  versionModalText: string;
  archiveModalText: string;
  versionToRevert = '';
  isCNInstance = process.env.NG_APP_LEOS_INSTANCE === 'cn';
  versionToArchive: Version;

  private removeEventListener?: () => void;

  constructor(
    public doc: DocumentService,
    private config: AppConfigService,
    private elementRef: ElementRef<HTMLElement>,
    private translate: TranslateService,
    @Inject(DOCUMENT_ACTIONS_SERVICE)
    private documentActions: DocumentActionsService,
    public viewVersionService: ViewVersionService,
  ) {}

  ngOnInit(): void {
    this.interceptClicks(this.elementRef.nativeElement);
    this.disabled = this.version.mostRecentVersion;
    this.setArchivePermission();
  }

  canRevertVersion() {
    return this.versionsPaneGroupComponent?.canRevertVersion;
  }

  ngOnDestroy(): void {
    this.removeEventListener?.();
  }

  checkVersion() {
    this.doc.checkVersion(this.version.cmisVersionNumber).subscribe({
      next: (isArchived: boolean) => {
        if (isArchived) {
          this.showVersionAlreadyArchived();
        }
      }
    });
  }

  handleVersionRevertOpenEditor(version: string, versionNumber: { major: number; intermediate: number; minor: number }) {
    this.documentActions.handleOpenEditor(() => this.onVersionRevert(version, versionNumber));
  }

  onVersionRevert(
    version: string,
    versionNumber: { major: number; intermediate: number; minor: number },
  ) {
    this.translate
      .get('page.editor.versions.restore.modal-text-version', {
        versionNumber: `${versionNumber.major}.${versionNumber.intermediate}.${versionNumber.minor}`,
      })
      .subscribe((res) => {
        this.versionModalText = res;
      });
    this.versionToRevert = version;
    this.versionRevertDialog.openDialog();
  }

  showVersionAlreadyArchived() {
    this.versionAlreadyMessage.openMessageBox();
    this.doc.reloadView();
  }


  onBaseChange(version: any) {
    this.doc.changeBaseVersion(version);
  }

  onAccept() {
    this.versionRevertDialog.closeDialog();
    this.doc.versionRevert(this.versionToRevert);
    this.versionToRevert = '';
    this.versionModalText = '';
    this.handleReload();
  }

  onCancel() {
    this.versionRevertDialog.closeDialog();
    this.versionToRevert = '';
    this.versionModalText = '';
  }

  handleReload() {
    this.doc.reloadDocument();
  }

  handleCheckboxClick(version: Version) {
    setTimeout(() => {
      this.viewVersionService.setVersionIdToView(version.documentId);
    });
    this.doc.resetZoomValues();
  }

  /**
   * Prevents `disabled` menu from opening.
   *
   * This has to be done imperatively because Angular does not support event
   * capturing, which is required in order to prevent `eui-dropdown` code from
   * handling the event.
   *
   * @see https://stackoverflow.com/questions/43253099/can-angular-use-capture-rather-than-bubbling-to-catch-events
   */
  private interceptClicks(elem: HTMLElement) {
    const listener = (event: MouseEvent) => {
      if (this.disabled) {
        consumeEvent(event);
      }
    };
    const options: EventListenerOptions = { capture: true };

    elem.addEventListener('click', listener, options);
    this.removeEventListener = () => {
      elem.removeEventListener('click', listener, options);
      this.removeEventListener = undefined;
    };
  }

  isLatestRecentVersion(version: Version) {
    return this.versionsPaneGroupComponent?.isLatestRecentVersion(version);
  }

  isMinorVersion(version: Version) {
    return this.versionsPaneGroupComponent?.isMinorVersion(version);
  }

  private setArchivePermission() {
    this.config.config.subscribe((config) => {
      this.canArchiveVersion = config.userAppPermissions.includes('CAN_ARCHIVE_VERSION');
    });
  }

  shouldArchive(version: Version): boolean {
    return this.isMinorVersion(version) && this.canArchiveVersion && !this.isLatestRecentVersion(version)
  }

  onCancelArchive() {
    this.versionModalText = '';
    this.versionRevertDialog.closeDialog();
  }

  onAcceptArchive() {
    this.versionRevertDialog.closeDialog();
    this.versionModalText = '';
    this.doc.archiveVersion(this.versionToArchive);
  }

  archiveVersion(version: Version) {
    this.versionToArchive = version;
    this.translate
      .get('page.editor.versions.archive.modal-text-version', {
        versionNumber: `${version.cmisVersionNumber}`,
      })
      .subscribe((res) => {
        this.archiveModalText = res;
      });
    this.versionArchiveDialog.openDialog();
  }
}
