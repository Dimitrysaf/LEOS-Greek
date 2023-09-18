import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class BlockDocumentEditorService {
  public isDocumentEditorBlocked$: Observable<boolean>;

  private blockDocumentEdtiorBS = new BehaviorSubject<boolean>(false);

  constructor() {
    this.isDocumentEditorBlocked$ = this.blockDocumentEdtiorBS.asObservable();
  }

  setIsDocumentEdtiorBlocked(value: boolean) {
    console.log('blocking document cotnent', value);
    this.blockDocumentEdtiorBS.next(value);
  }
}
