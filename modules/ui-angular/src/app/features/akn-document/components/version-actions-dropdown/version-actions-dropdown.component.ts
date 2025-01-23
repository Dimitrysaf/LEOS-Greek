import {
  Component,
  ElementRef,
  EventEmitter,
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
import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';
import { DocumentService } from '@/shared/services/document.service';
import { AppConfigService } from '@/core/services/app-config.service';
import { VersionsPaneGroupComponent } from '@/features/akn-document/components/versions-pane-group/versions-pane-group.component';

import { ViewVersionService } from '../../services/view-version.service';
import Observable from "rxjs";
import {EuiMessageBoxComponent} from "@eui/components/eui-message-box";

@Component({
  selector: 'app-version-actions-dropdown',
  templateUrl: './version-actions-dropdown.component.html',
  styleUrls: ['./version-actions-dropdown.component.scss'],
})
export class VersionActionsDropdownComponent implements OnInit, OnDestroy {
  @Input() version: Version;
  @Input() isMilestone?: boolean;
  @Output() exploreMilestone = new EventEmitter<Version>();
  @ViewChild('versionRevertDialog') versionRevertDialog: EuiDialogComponent;
  @ViewChild('versionAlreadyMessage') versionAlreadyMessage : EuiMessageBoxComponent;
  disabled: boolean;
  canArchiveVersion: boolean;
  versionModalText: string;
  versionToRevert = '';
  isCNInstance = process.env.NG_APP_LEOS_INSTANCE === 'cn';
  canRevertVersion: any;

  private removeEventListener?: () => void;

  constructor(
    public doc: DocumentService,
    private config: AppConfigService,
    private elementRef: ElementRef<HTMLElement>,
    private translate: TranslateService,
    private tableOfContentService: TableOfContentService,
    public viewVersionService: ViewVersionService,
    public versionsPaneGroupComponent: VersionsPaneGroupComponent
  ) {}

  ngOnInit(): void {
    this.interceptClicks(this.elementRef.nativeElement);
    this.disabled = this.version.mostRecentVersion;
    this.findUpdatePermission();
    this.setArchivePermission();
  }

  findUpdatePermission() {
    this.canRevertVersion = this.doc.hasUpdatePermission();
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
    return this.versionsPaneGroupComponent.isLatestRecentVersion(version);
  }

  isMinorVersion(version: Version) {
    return this.versionsPaneGroupComponent.isMinorVersion(version);
  }

  private setArchivePermission() {
    this.config.config.subscribe((config) => {
      this.canArchiveVersion = config.userAppPermissions.includes('CAN_ARCHIVE_VERSION');
    });
  }

  shouldArchive(version: Version): boolean {
    return this.isMinorVersion(version) && this.canArchiveVersion && !this.isLatestRecentVersion(version)
  }

}
