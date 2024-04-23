import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { EuiDropdownButtonMenuItem } from '@eui/components/eui-dropdown-button-menu';

import { RibbonToolbarBaseComponent } from '@/features/akn-document/components/ribbon-toolbar-base/ribbon-toolbar-base.component';

import {
  IRibbonToolbarItem,
  IRibbonToolbarSection,
  IRibbonToolbarType,
} from '../../models/document-actions.model';

@Component({
  selector: 'app-ribbon-toolbar-section',
  templateUrl: './ribbon-toolbar-section.component.html',
  styleUrls: ['./ribbon-toolbar-section.component.scss'],
})
export class RibbonToolbarSectionComponent
  extends RibbonToolbarBaseComponent<IRibbonToolbarSection>
  implements OnInit, AfterViewInit
{
  @Input() resizeMap: Map<string, boolean>;
  @Input() mainContainerId;
  @Input() versionMainContainerId = 'versionMainContainer';
  @Input() versionComparisonMainContainerId = 'versionComparisonMainContainer';
  @Input() contributionViewMainContainerId = 'contributionViewMainContainer';
  isSectionOverflow = false;

  didDropdownRenderedAsRibbonItems = false;

  constructor() {
    super();
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    super.ngOnInit();
  }

  mapEuiDropdownMenuItemToRibbonToolbarItems(
    items: EuiDropdownButtonMenuItem[],
  ): IRibbonToolbarItem[] {
    this.didDropdownRenderedAsRibbonItems = true;
    return items.map(
      (euiItem) =>
        ({
          type: IRibbonToolbarType.BUTTON,
          id: euiItem.id,
          label: euiItem.label,
          actionFn: () => euiItem.command(),
          euiSize: 's',
        } as IRibbonToolbarItem),
    );
  }

  protected readonly IRibbonToolbarType = IRibbonToolbarType;

  protected handleDropdownClick(event: MouseEvent) {
    event.preventDefault();
  }
}
