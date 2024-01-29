import { Component, Input, OnInit } from '@angular/core';

import { RibbonToolbarBaseComponent } from '@/features/akn-document/components/ribbon-toolbar-base/ribbon-toolbar-base.component';
import {
  IBaseRibbonToolbarItem,
  IRibbonToolbarDropdown,
} from '@/features/akn-document/models/document-actions.model';

@Component({
  selector: 'app-ribbon-toolbar-dropdown',
  templateUrl: './ribbon-toolbar-dropdown.component.html',
  styleUrls: ['./ribbon-toolbar-dropdown.component.scss'],
})
export class RibbonToolbarDropdownComponent
  extends RibbonToolbarBaseComponent
  implements OnInit
{
  @Input() dropdownItem: IRibbonToolbarDropdown;
  @Input() isOverflow = false;

  constructor() {
    super();
  }

  ngOnInit(): void {}
}
