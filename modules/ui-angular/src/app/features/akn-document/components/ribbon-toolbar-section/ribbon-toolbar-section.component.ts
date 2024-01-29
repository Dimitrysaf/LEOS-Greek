import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

import { RibbonToolbarBaseComponent } from '@/features/akn-document/components/ribbon-toolbar-base/ribbon-toolbar-base.component';

import {
  IRibbonToolbarSection,
  IRibbonToolbarType,
} from '../../models/document-actions.model';

@Component({
  selector: 'app-ribbon-toolbar-section',
  templateUrl: './ribbon-toolbar-section.component.html',
  styleUrls: ['./ribbon-toolbar-section.component.scss'],
})
export class RibbonToolbarSectionComponent
  extends RibbonToolbarBaseComponent
  implements OnInit, AfterViewInit
{
  @Input() sectionItem: IRibbonToolbarSection;
  @Input() resizeMap: Map<string, boolean>;
  isSectionOverflow = false;

  constructor() {
    super();
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  protected readonly IRibbonToolbarType = IRibbonToolbarType;

  protected handleDropdownClick(event: MouseEvent) {
    event.preventDefault();
  }
}
