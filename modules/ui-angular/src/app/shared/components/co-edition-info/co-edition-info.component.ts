import { formatDate } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';

import { CoEditionVO } from '@/shared/models/coEditionVO.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import {keys} from "lodash-es";

import { getUserDetails, UserDetails } from '@eui/base';
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-co-edition-info',
  templateUrl: './co-edition-info.component.html',
  styleUrls: ['./co-edition-info.component.scss'],
})
export class CoEditionInfoComponent implements OnInit, OnDestroy {
  @Input() documentCoEditions?: CoEditionVO[];
  @Input() isToc?: boolean;
  @Input() isNotTocNodeLevel?: boolean;
  @Input() nodeId?:string;

  coEditionForToc: CoEditionVO[];
  coEditionForDocumentId: Record<string, CoEditionVO[]>;
  user: UserDetails;

  private destroy$: Subject<any> = new Subject();
  constructor(private coEditionService: CoEditionServiceWS, private store: Store<any>) {
    this.coEditionService.toCCoEditionInfo
      .pipe(takeUntil(this.destroy$))
      .subscribe((coEdits) => {
        this.coEditionForToc = coEdits;
      });
    this.coEditionService.getDocCoEditionInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe((coEdits: Record<string, CoEditionVO[]>) => {
        this.coEditionForDocumentId = coEdits;
      });
    this.store
      .select(getUserDetails)
      .pipe(take(1))
      .subscribe((state) => (this.user = state));
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  ngOnInit(): void {}

  isNodeCoEdited(){
    let result = keys(this.coEditionForDocumentId).includes(this.nodeId);
    if(!result){
      result =  keys(this.coEditionForDocumentId).some(
        (key) =>
          !document.querySelector(`[data-id="${key}"]`)
          && !!document.querySelector(`#${this.nodeId}`)
          && Array.from(document.querySelector(`#${this.nodeId}`).children)
            .some((child) => child.matches(`#${key}`) )
      );
    }
    return result;
  }

  generateTooltip(coEdits: CoEditionVO[]) {
    if (!coEdits) return;
    let target = '';
    coEdits.forEach(
      (c) =>
        (target =
          target +
          `${c.userName} editing since ${formatDate(
            new Date(c.editionTime),
            'dd/MM/yyyy HH:mm',
            'en-US',
          )} \n `),
    );
    return target;
  }

  generateStyleClass(defaultStyleClass: string, coEdits: CoEditionVO[]) {
    let coEditionStyleClass = defaultStyleClass + " leos-user-coedition";
    if (coEdits.find((c) => (c.userLoginName === this.user.login)) != undefined) {
      coEditionStyleClass += " leos-user-coedition-self-user";
    }
    return coEditionStyleClass;
  }

  getCoEditsForElement() {
    let coEdits: CoEditionVO[];
    const coEditKeys = keys(this.coEditionForDocumentId);
    const result = coEditKeys.includes(this.nodeId);
    if (result) {
      coEdits = this.coEditionForDocumentId[this.nodeId];
    } else {
      coEditKeys.forEach(
        (key) => {
          if (!!document.querySelector(`#${key}`)?.closest(`#${this.nodeId}`)) {
            coEdits = this.coEditionForDocumentId[key];
          }
        });
    }
    return coEdits;
  }
}
