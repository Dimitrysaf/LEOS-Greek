import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlockDocumentEditorService {
  public isDocumentEditorBlocked$: Observable<boolean>;

  private blockDocumentEditorBS = new BehaviorSubject<boolean>(false);

  constructor() {
    this.isDocumentEditorBlocked$ = this.blockDocumentEditorBS.asObservable();
  }

  setIsDocumentEditorBlocked(value: boolean) {
    this.blockDocumentEditorBS.next(value);
  }
}
