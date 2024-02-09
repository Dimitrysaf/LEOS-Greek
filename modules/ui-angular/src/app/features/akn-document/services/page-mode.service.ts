import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum PageMode {
  Normal,
  ViewVersion,
  CompareVersions,
  Contribution,
}

@Injectable({
  providedIn: 'root',
})
export class PageModeService {
  pageMode$: Observable<PageMode>;

  private pageModeBS = new BehaviorSubject<PageMode>(PageMode.Normal);

  constructor() {
    this.pageMode$ = this.pageModeBS.asObservable();
  }

  setPageMode(mode: PageMode) {
    this.pageModeBS.next(mode);
  }
}
