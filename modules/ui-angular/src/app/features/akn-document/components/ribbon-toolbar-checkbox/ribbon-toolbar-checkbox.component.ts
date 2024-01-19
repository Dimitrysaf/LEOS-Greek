import { Component, Input, OnInit } from '@angular/core';

import { IRibbonToolbarCheckbox } from '../../models/document-actions.model';
import { RibbonToolbarBaseComponent } from '../ribbon-toolbar-base/ribbon-toolbar-base.component';

@Component({
  selector: 'app-ribbon-toolbar-checkbox',
  templateUrl: './ribbon-toolbar-checkbox.component.html',
  styleUrls: ['./ribbon-toolbar-checkbox.component.scss'],
})
export class RibbonToolbarCheckboxComponent
  extends RibbonToolbarBaseComponent
  implements OnInit
{
  @Input() checkboxItem: IRibbonToolbarCheckbox;
  @Input() isOverflow = false;

  constructor() {
    super();
  }

  onChange(): void {
    this.checkboxItem.value = !this.checkboxItem.value;
    if (this.checkboxItem.actionFn) {
      this.checkboxItem.actionFn();
    }
  }
}
