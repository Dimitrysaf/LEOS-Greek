import { Component, Input, OnInit } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';

import {
  COMPARE_NEXT_CHANGE_ACTION_ID,
  COMPARE_PREV_CHANGE_ACTION_ID,
  MERGE_CONTRIBUTION_NEXT_CHANGE_ID,
  MERGE_CONTRIBUTION_PREV_CHANGE_ID,
} from '@/shared/constants/document-actions.constants';

import { IRibbonToolbarButton } from '../../models/document-actions.model';
import { RibbonToolbarBaseComponent } from '../ribbon-toolbar-base/ribbon-toolbar-base.component';

enum StyleMode {
  Default,
  NextChangeStyle,
  PrevChangeStyle,
}
@Component({
  selector: 'app-ribbon-toolbar-button',
  templateUrl: './ribbon-toolbar-button.component.html',
  styleUrls: ['./ribbon-toolbar-button.component.scss'],
})
export class RibbonToolbarButtonComponent
  extends RibbonToolbarBaseComponent<IRibbonToolbarButton>
  implements OnInit
{
  @Input() isOverflow = false;
  styleMode = StyleMode.Default;
  StyleMode = StyleMode;
  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    if (
      this.item.id === COMPARE_NEXT_CHANGE_ACTION_ID ||
      this.item.id === MERGE_CONTRIBUTION_NEXT_CHANGE_ID
    ) {
      this.styleMode = StyleMode.NextChangeStyle;
    } else if (
      this.item.id === COMPARE_PREV_CHANGE_ACTION_ID ||
      this.item.id === MERGE_CONTRIBUTION_PREV_CHANGE_ID
    ) {
      this.styleMode = StyleMode.PrevChangeStyle;
    }
  }
}
