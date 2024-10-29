import { Injectable } from '@angular/core';
import {EuiAppShellService, EuiGrowlService} from '@eui/core';
import {BehaviorSubject, debounceTime, Observable, takeUntil} from 'rxjs';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private tasksOngoing: { name: string; key: string }[] = [];

  private loadingBS = new BehaviorSubject<boolean>(false);

  constructor(private euiAppShellService: EuiAppShellService, private appShellService: EuiGrowlService, private translate: TranslateService) {
    this.loadingBS.asObservable().subscribe((val) => {
      this.euiAppShellService.isBlockDocumentActive = val;
    });
  }

  showOrHideTask(taskName: string, key: string, ongoing: boolean) {
    if (ongoing) {
      if (
        !this.tasksOngoing.some(
          (i) => i.name === taskName && i.key === key,
        )
      ) {
        this.tasksOngoing.push({
          name: taskName,
          key: key,
        });
      }
    } else if (
      this.tasksOngoing.some(
        (i) => i.name === taskName && i.key === key,
      )
    ) {
      this.tasksOngoing = this.tasksOngoing.filter(
        (item) =>
          item.name !== taskName && item.key !== key,
      );
    }
    let target = '';
    this.tasksOngoing
      .filter(
        (value, index, array) =>
          index === array.findIndex((item) => item.name === value.name),
      )
      .forEach(
        (c) =>
          (target =
            target +
            ' ' +
            this.translate.instant('task.' + c.name + '.ongoing') +
            ' '),
      );
    if (this.tasksOngoing.length > 0) {
      this.appShellService.growl({
        severity: 'info',
        summary: 'Tasks ongoing',
        detail: target,
        sticky: true,
      });
    } else {
      this.appShellService.growl({
        severity: 'info',
        summary: 'Tasks over',
        detail: target,
        life: 1,
      });
    }
  }

  setLoading(loading: boolean) {
    this.loadingBS.next(loading);
  }

  setTaskOngoing(taskName: string, key: string) {
    this.showOrHideTask(taskName, key, true );
  }

  setTaskOver(taskName: string, key: string) {
    this.showOrHideTask(taskName, key, false );
  }
}
