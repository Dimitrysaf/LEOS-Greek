import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  MergeActionItem,
  MergeActionVO,
} from '@/shared/models/merge-action-vo.model';

export enum TrackChangeAction {
  ADD,
  DEL,
  MOVED_TO,
  MOVED_FROM,
}

@Injectable({
  providedIn: 'root',
})
export class MergeActionsService {
  private LEOS_UID_ATTR = 'leos\\:uid';
  private LEOS_TRACK_ACTION = 'leos\\:action';
  private LEOS_SOFT_ACTION = 'leos\\:softaction';
  private MOVE_FROM = 'move_from';
  private MOVE_TO = 'move_to';
  private MOVE = 'move';
  private DELETE = 'delete';
  private ADD = 'add';
  private CONTENT_CHANGE = 'content_change';

  private mergeActionList: MergeActionVO[] = new Array();

  public showMenu$: Observable<{
    event: MouseEvent;
    element: HTMLElement;
    actions: HTMLElement;
  }>;
  private showMenuBS = new BehaviorSubject<{
    event: MouseEvent;
    element: HTMLElement;
    actions: HTMLElement;
  }>(null);
  public updateMergeActionList$: Observable<MergeActionVO>;
  private updateMergeActionListBS = new BehaviorSubject<MergeActionVO>(null);

  constructor() {
    this.showMenu$ = this.showMenuBS.asObservable();
    this.updateMergeActionList$ = this.updateMergeActionListBS.asObservable();
  }

  public getMergeActionList(): MergeActionItem[] {
    return this.mergeActionList;
  }

  public addMergeActionList(action: MergeActionVO) {
    this.mergeActionList.push(action);
    this.updateMergeActionListBS.next(action);
  }

  public removeMergeActionList(element: HTMLElement) {
    this.mergeActionList = this.mergeActionList.filter((action) => {
      action.elementId !== element.getAttribute('id').replace('revision-', '');
    });
    const action = this.mergeActionList.find((action) => {
      action.elementId === element.getAttribute('id').replace('revision-', '');
    });
    this.updateMergeActionListBS.next(action);
  }

  public getAction(elt: HTMLElement) {
    let elementState;
    const action = elt.getAttribute(this.LEOS_TRACK_ACTION);
    const softAction = elt.getAttribute(this.LEOS_SOFT_ACTION);
    const parentAffected = elt.getAttribute('parent_affected');
    if (
      softAction &&
      (softAction === this.MOVE_FROM || softAction === this.MOVE_TO)
    ) {
      elementState = this.MOVE;
    } else if (action === 'delete') {
      elementState = this.DELETE;
    } else if (action === 'insert') {
      elementState = this.ADD;
    } else if (parentAffected) {
      elementState = this.CONTENT_CHANGE;
    }
    return elementState;
  }

  public showMenu(
    event: MouseEvent,
    element: HTMLElement,
    actions: HTMLElement,
  ) {
    this.showMenuBS.next({ event, element, actions });
  }
}
