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
import { DocumentService } from '@/shared/services/document.service';

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
  disabled: boolean;
  versionModalText: string;
  versionToRevert = '';

  private removeEventListener?: () => void;

  constructor(
    public doc: DocumentService,
    private elementRef: ElementRef<HTMLElement>,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.interceptClicks(this.elementRef.nativeElement);
    this.disabled = this.version.mostRecentVersion;
  }

  ngOnDestroy(): void {
    this.removeEventListener?.();
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

  onAccept() {
    this.versionRevertDialog.closeDialog();
    this.doc.versionRevert(this.versionToRevert);
    this.versionToRevert = '';
    this.versionModalText = '';
  }

  onCancel() {
    this.versionRevertDialog.closeDialog();
    this.versionToRevert = '';
    this.versionModalText = '';
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
}
