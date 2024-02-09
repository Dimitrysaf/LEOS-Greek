import { Component, Input, OnInit } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';

import { IRibbonToolbarButton } from '../../models/document-actions.model';
import { RibbonToolbarBaseComponent } from '../ribbon-toolbar-base/ribbon-toolbar-base.component';

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

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
