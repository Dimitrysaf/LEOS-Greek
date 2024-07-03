import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { EuiDropdownComponent } from '@eui/components/eui-dropdown';
import { DropdownModel } from '@/shared/dropdown.model';

@Component({
  selector: 'app-dynamic-dropdown-click',
  template: `
    <eui-dropdown #menu>
      <ng-content></ng-content>
      <eui-dropdown-content>
        <ng-container *ngFor="let item of items">
          <button
            *ngIf="!item.children; else itemWithChildren"
            euiDropdownItem
            class="eui-u-p-s"
            (click)="item.command()"
            [attr.aria-label]="item.label"
            [disabled]="item.disabled"
          >
            <span euiLabel class="eui-u-m-2xs">{{ item.label }}</span>
          </button>
          <ng-template #itemWithChildren>
            <button
              euiDropdownItem
              [subDropdown]="subDropdown.menu"
              (click)="subDropdown.menu.openDropdown($any($event).target)"
              [attr.aria-label]="item.label"
              [disabled]="item.disabled"
              class="eui-u-p-s"
            >
              <span euiLabel class="eui-u-m-2xs">{{ item.label }}</span>
            </button>
            <app-dynamic-dropdown-click
              #subDropdown
              [items]="item.children"
            ></app-dynamic-dropdown-click>
          </ng-template>
        </ng-container>
      </eui-dropdown-content>
    </eui-dropdown>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class DynamicDropdownClickComponent {
  @ViewChild('menu', { static: true }) menu: EuiDropdownComponent;
  @ViewChild('subDropdown', { static: true })
  subDropdown: DynamicDropdownClickComponent;
  @Input() items: DropdownModel[];
}
