import { Injectable } from '@angular/core';
import { UxAppShellService } from '@eui/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loading$: Observable<boolean>;

  private loadingBS = new BehaviorSubject<boolean>(false);

  constructor(private uxAppService: UxAppShellService) {
    this.loadingBS.asObservable().subscribe((val) => {
      this.uxAppService.isBlockDocumentActive = val;
    });
  }

  setLoading(loading: boolean) {
    this.loadingBS.next(loading);
  }
}
