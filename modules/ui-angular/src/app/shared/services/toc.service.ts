import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { TableOfContentItemVO } from '@/features/akn-document/models/toc.model';

@Injectable({
  providedIn: 'root',
})
export class TocService {
  tocItems$: Observable<TableOfContentItemVO[]>;
  private tocItemBS = new BehaviorSubject<TableOfContentItemVO[]>(null);

  constructor(private http: HttpClient) {
    this.tocItems$ = this.tocItemBS.asObservable();
  }

  getTocItems(annexRef: string, tocMode = 'SIMPLIFIED') {
    this.http
      .get<TableOfContentItemVO[]>(
        `api/secured/annex/${annexRef}/getTocItems`,
        {
          params: { tocMode },
        },
      )
      .subscribe((res) => {
        this.tocItemBS.next(res);
      });
  }

  setToc(toc: TableOfContentItemVO[]) {
    this.tocItemBS.next(toc);
  }
}
