import { Component, Input, OnInit } from '@angular/core';

import { RibbonToolbarBaseComponent } from '@/features/akn-document/components/ribbon-toolbar-base/ribbon-toolbar-base.component';
import { IRibbonToolbarDropdown } from '@/features/akn-document/models/document-actions.model';
import { DropdownModel } from '@/shared/dropdown.model';

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
  dropdownItems: DropdownModel[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dropdownItems = this.item.items;
  }
}
