import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ribbon-toolbar-base',
  templateUrl: './ribbon-toolbar-base.component.html',
  styleUrls: ['./ribbon-toolbar-base.component.scss'],
})
export class RibbonToolbarBaseComponent implements OnInit, OnDestroy {
  constructor() {}

  protected destroy$ = new Subject();

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
