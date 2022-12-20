import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { consumeEvent } from '@eui/core';

import { Version } from '@/features/akn-document/models/versions';
import { DocumentService } from '@/features/akn-document/services/document.service';

@Component({
  selector: 'app-version-actions-dropdown',
  templateUrl: './version-actions-dropdown.component.html',
  styleUrls: ['./version-actions-dropdown.component.scss'],
})
export class VersionActionsDropdownComponent implements OnInit, OnDestroy {
  @Input() version: Version;
  disabled: boolean;

  private removeEventListener?: () => void;

  constructor(
    public doc: DocumentService,
    private elementRef: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {
    this.interceptClicks(this.elementRef.nativeElement);
    this.disabled = this.version.mostRecentVersion;
  }

  ngOnDestroy(): void {
    this.removeEventListener?.();
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
