import { Injectable } from '@angular/core';
import { EuiAppShellService } from '@eui/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loading$: Observable<boolean>;
  task$: Observable<{ taskName: string; key: string; ongoing: boolean }>;

  private loadingBS = new BehaviorSubject<boolean>(false);
  private taskBS = new BehaviorSubject<{
    taskName: string;
    key: string;
    ongoing: boolean;
  }>({ taskName: null, key: null, ongoing: false });

  constructor(private euiAppShellService: EuiAppShellService) {
    this.loadingBS.asObservable().subscribe((val) => {
      this.euiAppShellService.isBlockDocumentActive = val;
    });
    this.task$ = this.taskBS.asObservable();
  }

  setLoading(loading: boolean) {
    this.loadingBS.next(loading);
  }

  setTaskOngoing(taskName: string, key: string) {
    this.taskBS.next({ taskName, key, ongoing: true });
  }

  setTaskOver(taskName: string, key: string) {
    this.taskBS.next({ taskName, key, ongoing: false });
  }
}
