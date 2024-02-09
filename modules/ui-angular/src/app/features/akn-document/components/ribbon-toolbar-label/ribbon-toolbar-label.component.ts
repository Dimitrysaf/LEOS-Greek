import { Component, Input, OnInit } from '@angular/core';

import { RibbonToolbarBaseComponent } from '@/features/akn-document/components/ribbon-toolbar-base/ribbon-toolbar-base.component';
import { IRibbonToolbarLabel } from '@/features/akn-document/models/document-actions.model';

@Component({
  selector: 'app-ribbon-toolbar-label',
  templateUrl: './ribbon-toolbar-label.component.html',
  styleUrls: ['./ribbon-toolbar-label.component.scss'],
})
export class RibbonToolbarLabelComponent
  extends RibbonToolbarBaseComponent<IRibbonToolbarLabel>
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
