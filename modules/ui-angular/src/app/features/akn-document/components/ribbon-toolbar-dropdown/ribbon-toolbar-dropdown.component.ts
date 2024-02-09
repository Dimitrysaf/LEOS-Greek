import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EuiDropdownButtonMenuComponent } from '@eui/components/eui-dropdown-button-menu';

import { RibbonToolbarBaseComponent } from '@/features/akn-document/components/ribbon-toolbar-base/ribbon-toolbar-base.component';
import {
  IBaseRibbonToolbarItem,
  IRibbonToolbarCheckbox,
  IRibbonToolbarDropdown,
} from '@/features/akn-document/models/document-actions.model';

@Component({
  selector: 'app-ribbon-toolbar-dropdown',
  templateUrl: './ribbon-toolbar-dropdown.component.html',
  styleUrls: ['./ribbon-toolbar-dropdown.component.scss'],
})
export class RibbonToolbarDropdownComponent
  extends RibbonToolbarBaseComponent<IRibbonToolbarDropdown>
  implements OnInit
{
  @Input() isOverflow = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
