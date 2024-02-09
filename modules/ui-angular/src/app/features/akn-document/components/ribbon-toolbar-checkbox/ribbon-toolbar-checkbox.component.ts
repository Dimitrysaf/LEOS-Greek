import { Component, Input, OnInit } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';

import {
  IRibbonToolbarCheckbox,
  IRibbonToolbarItem,
} from '../../models/document-actions.model';
import { RibbonToolbarBaseComponent } from '../ribbon-toolbar-base/ribbon-toolbar-base.component';

@Component({
  selector: 'app-ribbon-toolbar-checkbox',
  templateUrl: './ribbon-toolbar-checkbox.component.html',
  styleUrls: ['./ribbon-toolbar-checkbox.component.scss'],
})
export class RibbonToolbarCheckboxComponent
  extends RibbonToolbarBaseComponent<IRibbonToolbarCheckbox>
  implements OnInit
{
  @Input() isOverflow = false;
  checkboxValue = false;

  constructor() {
    super();
  }

  onChange(): void {
    this.item.value = !this.item.value;
    if (this.item.actionFn) {
      this.item.actionFn();
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.initCheckBoxValue();
  }

  private initCheckBoxValue() {
    if (this.item.value === null) return;

    if (this.item.value instanceof Observable) {
      this.item.value
        .pipe(takeUntil(this.destroy$))
        .subscribe((value) => (this.checkboxValue = value));
    } else {
      this.checkboxValue = this.item.value;
    }
  }
}
