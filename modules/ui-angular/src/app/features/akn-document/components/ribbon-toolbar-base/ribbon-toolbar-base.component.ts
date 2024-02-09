import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { IRibbonToolbarItem } from '@/features/akn-document/models/document-actions.model';

@Component({
  selector: 'app-ribbon-toolbar-base',
  templateUrl: './ribbon-toolbar-base.component.html',
  styleUrls: ['./ribbon-toolbar-base.component.scss'],
})
export class RibbonToolbarBaseComponent<T extends IRibbonToolbarItem>
  implements OnInit, OnDestroy
{
  @Input() item: T;
  itemLabelValue: string;
  isItemDisabled = false;

  constructor() {}

  protected destroy$ = new Subject();

  ngOnInit(): void {
    this.initDisabled();
    this.initLabel();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private initDisabled() {
    if (this.item.disabled === null) return;
    if (this.item.disabled instanceof Observable) {
      this.item.disabled
        .pipe(takeUntil(this.destroy$))
        .subscribe((disabled) => {
          this.isItemDisabled = disabled;
        });
    } else {
      this.isItemDisabled = this.item.disabled;
    }
  }

  private initLabel() {
    if (this.item.label === null) return;
    if (this.item.label instanceof Observable) {
      this.item.label.pipe(takeUntil(this.destroy$)).subscribe((label) => {
        this.itemLabelValue = label;
      });
    } else {
      this.itemLabelValue = this.item.label;
    }
  }
}
