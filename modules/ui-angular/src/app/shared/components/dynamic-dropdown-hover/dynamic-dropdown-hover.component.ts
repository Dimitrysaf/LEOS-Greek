import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { EuiDropdownComponent } from '@eui/components/eui-dropdown';
import { DropdownModel } from '@/shared/dropdown.model';

@Component({
  selector: 'app-dynamic-dropdown-hover',
  template: `
    <eui-dropdown isExpandOnHover #menu>
      <ng-content></ng-content>
      <eui-dropdown-content>
        <ng-container *ngFor="let item of items">
          <button
            *ngIf="!item.children; else itemWithChildren"
            euiDropdownItem
            class="eui-u-p-s"
            (click)="item.command()"
            [disabled]="item.disabled"
            [attr.aria-label]="item.label"
          >
            <span euiLabel>{{ item.label }}</span>
          </button>
          <ng-template #itemWithChildren>
            <button
              euiDropdownItem
              [subDropdown]="subDropdown.menu"
              (mouseenter)="subDropdown.menu.openDropdown($any($event).target)"
              [attr.aria-label]="item.label"
              [disabled]="item.disabled"
              class="eui-u-p-s"
            >
              <span euiLabel>{{ item.label }}</span>
            </button>
            <app-dynamic-dropdown-hover
              #subDropdown
              [items]="item.children"
            ></app-dynamic-dropdown-hover>
          </ng-template>
        </ng-container>
      </eui-dropdown-content>
    </eui-dropdown>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class DynamicDropdownHoverComponent {
  @ViewChild('menu', { static: true }) menu: EuiDropdownComponent;
  @ViewChild('subDropdown', { static: true })
  subDropdown: DynamicDropdownHoverComponent;
  @Input() items: DropdownModel[];
}
