import { Injectable, Inject } from '@angular/core';
import { getUserDetails, UserDetails } from '@eui/base';
import { Store } from '@ngrx/store';
import { groupBy, keys } from 'lodash-es';
import { BehaviorSubject, Observable, Subject, Subscription, take } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { apiBaseUrl } from 'src/config';
import * as Stomp from 'stompjs';
import { DOCUMENT, formatDate } from '@angular/common';

import {
  CoEditionActionInfo,
  CoEditionUpdate,
  CoEditionVO,
} from '../models/coEditionVO.model';

export type CO_EDITION_ACTION = 'EDIT_ELEMENT' | 'EDIT_TOC';

export interface SubscriptionEvent {
  topic: string;
  callback: (message) => void;
  id: string;
}

export interface MessageEvent {
  topic: string;
  payload: string;
}
@Injectable({
  providedIn: 'root',
})
export class CoEditionServiceWS {
  private user: UserDetails;
  private sessionId: string;

  private stompClient: Stomp.Client;

  //group per document id, used for screen 2 to indicate which document is being edited
  private groupedCoEditionsById: BehaviorSubject<
    Record<string, CoEditionVO[]>
  > = new BehaviorSubject(null);
  //only for the toc
  private coEditionForTocBS: BehaviorSubject<CoEditionVO[]> =
    new BehaviorSubject([]);
  //group per element id for the document being edited by the user
  private coEditionForDocument: BehaviorSubject<Record<string, CoEditionVO[]>> =
    new BehaviorSubject(null);
  //presenter id of the active editor page
  private presenterIDBS: BehaviorSubject<string> = new BehaviorSubject('');
  //handle update on the documents
  private shouldUpdateBS: BehaviorSubject<CoEditionUpdate | null> =
    new BehaviorSubject(null);
  private latestActionInfoBS: Subject<CoEditionActionInfo> = new Subject();

  //sometimes when we reload the connection hasn't yet established and the subscription or message is lost
  private requestQueue: MessageEvent[] = [];
  private subscribeQueue: SubscriptionEvent[] = [];

  constructor(
    private store: Store<any>,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.store
      .select(getUserDetails)
      .pipe(take(1))
      .subscribe((state) => (this.user = state));
  }

  public connect() {
    const socket = new SockJS(`${apiBaseUrl}/ws`, null, {
      transports: ['websocket', 'xhr-polling', 'jsonp-polling'],
      fallbackTransport: 'auto',
      debug: false,
    });
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = () => {};

    this.stompClient.connect({}, () => {
      while (this.subscribeQueue.length > 0) {
        const { topic, callback, id } = this.subscribeQueue.shift();
        this.subscribe(topic, callback, id);
      }
      this.sessionId = socket._transport.url.split('/')[7];
    });
  }

  public disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect(null);
    }
  }

  subscribe(topic: string, callback: (message) => void, id: string): void {
    if (!this.stompClient.subscriptions[id]) {
      this.stompClient.subscribe(topic, callback, { id: `${id}` });
    }
    this.stompClient.send(
      '/app/refresh/document',
      {},
      JSON.stringify({ userId: this.user.login, documentId: id })
    );
  }

  removeSession(): void {
    this.stompClient.send(
      '/app/removeSession',
      {},
      JSON.stringify({ sessionId: this.sessionId }),
    );
  }

  public joinDocumentChannel() {
    if (this.stompClient.connected) {
      this.subscribe(`/topic/document`, (message) => {
        this.handleDocumentChannel(message);
      }, 'document');
    } else
      this.subscribeQueue.push({
        topic: '/topic/document',
        callback: (message) => this.handleDocumentChannel(message),
        id: 'document'
      });
  }

  public joinSubDocumentChannel(documentId: string): void {
    if (this.stompClient.connected) {
      this.subscribe(`/topic/document/${documentId}`, (message) => {
        const coEdits = JSON.parse(message.body) as
          | CoEditionActionInfo
          | CoEditionVO[]
          | CoEditionUpdate;
        this.handleCoEditionMessage(coEdits);
      }, documentId);
    } else
      this.subscribeQueue.push({
        topic: `/topic/document/${documentId}`,
        callback: (message) => {
          const coEdits = JSON.parse(message.body) as
            | CoEditionActionInfo
            | CoEditionVO[]
            | CoEditionUpdate;
          this.handleCoEditionMessage(coEdits);
        },
        id: `${documentId}`
      });
  }

  public joinElementCoEditInfo(documentId: string, elementId: string) {
    this.stompClient.send(
      '/app/join/document',
      {},
      JSON.stringify({
        userId: this.user.login,
        documentId,
        presenterId: this.presenterId,
        elementId,
        infoType: 'ELEMENT_INFO',
      }),
    );
  }

  public removeElementCoEditInfo(documentId: string, elementId: string) {
    this.stompClient.send(
      '/app/remove/document',
      {},
      JSON.stringify({
        userId: this.user.login,
        documentId,
        presenterId: this.presenterId,
        elementId,
        infoType: 'ELEMENT_INFO',
      }),
    );
  }

  public removeDocumentCoEditInfo(documentId: string) {
    this.stompClient.send(
      '/app/remove/document',
      {},
      JSON.stringify({
        userId: this.user.login,
        documentId,
        presenterId: this.presenterId,
        infoType: 'DOCUMENT_INFO',
      }),
    );
  }

  public sendTocInlineEdit(documentId: string) {
    this.stompClient.send(
      '/app/join/document',
      {},
      JSON.stringify({
        userId: this.user.login,
        documentId,
        presenterId: this.presenterId,
        infoType: 'TOC_INFO',
      }),
    );
  }

  public removeTocInlineEdit(documentId: string) {
    this.stompClient.send(
      '/app/remove/document',
      {},
      JSON.stringify({
        userId: this.user.login,
        documentId,
        presenterId: this.presenterId,
        infoType: 'TOC_INFO',
      }),
    );
  }

  public sendUpdateDocumentEvent(
    documentId: string,
    elementId?: string,
    elementTagName?: string,
    elementFragment?: string,
  ) {
    this.stompClient.send(
      '/app/update/document',
      {},
      JSON.stringify({
        documentId,
        elementId,
        elementTagName,
        elementFragment,
        presenterId: this.presenterId,
        userId: this.user.login,
      }),
    );
  }

  checkForCoEdition(
    coEditionAction: CO_EDITION_ACTION,
    documentId?: string,
    elementId?: string,
  ) {
    if (coEditionAction === 'EDIT_TOC') {
      return this.coEditionForTocBS.value?.length > 0;
    }
    if (coEditionAction === 'EDIT_ELEMENT') {
      const elementsEdited = this.coEditionForDocument.value;
      return keys(elementsEdited).includes(elementId);
    }
  }

  setPresenterId(presenterId: string) {
    this.presenterIDBS.next(presenterId);
  }

  setShouldReloadAfterUpdate() {
    this.shouldUpdateBS.next(null);
  }

  getDocCoEditionInfo() {
    return this.coEditionForDocument.asObservable();
  }

  getDocCoEditionInfoData() {
    return this.coEditionForDocument.getValue();
  }

  get allCoEditionInfo(): Observable<Record<string, CoEditionVO[]>> {
    return this.groupedCoEditionsById.asObservable();
  }

  get toCCoEditionInfo(): Observable<CoEditionVO[]> {
    return this.coEditionForTocBS.asObservable();
  }

  get presenterId() {
    return this.presenterIDBS.value;
  }

  get shouldReloadAfterUpdate() {
    return this.shouldUpdateBS.asObservable();
  }

  get latestMessage() {
    return this.latestActionInfoBS.asObservable();
  }

  private handleCoEditForDocument(coEdits: CoEditionVO[]) {
    const coEditsFilterCurrUser = coEdits?.filter(
      (c) => c.sessionId !== this.sessionId,
    );
    const groupedCoEditsByElemenet = groupBy(
      coEditsFilterCurrUser,
      'elementId',
    );
    this.coEditionForDocument.next(groupedCoEditsByElemenet);
    //filter coEditions for TOC
    this.coEditionForTocBS.next(
      coEdits?.filter(
        (c) => c.infoType === 'TOC_INFO' && c.sessionId !== this.sessionId,
      ),
    );
  }

  private handleDocumentChannel(message: Stomp.Message) {
    const coEdits = JSON.parse(message.body) as CoEditionVO[];
    const groupedCoEdits = groupBy<CoEditionVO>(coEdits, 'documentId');
    this.groupedCoEditionsById.next(groupedCoEdits);
  }

  private handleCoEditionMessage(
    coEdits: CoEditionVO[] | CoEditionUpdate | CoEditionActionInfo,
  ) {
    if ('user' in coEdits) {
      const coEditUpdate = coEdits as CoEditionUpdate;
      this.shouldUpdateBS.next(coEditUpdate);
    }
    //handle operation logic
    if ('operation' in coEdits) {
      //handle the new CoEdition addition
      this.latestActionInfoBS.next(coEdits);
      //filter incoming coEditions per elementId and group them by Id
      this.handleCoEditForDocument(coEdits.coEditionVos);
    }
    if (Array.isArray(coEdits)) {
      this.handleCoEditForDocument(coEdits);
    }
  }

  public showElementsBeingEdited(coEdits: Record<string, CoEditionVO[]>, isCalledFromToc?: boolean) {
      const userCoEditionElements = this.document.querySelectorAll(
        '.leos-user-coedition',
      );
      userCoEditionElements.forEach((userCoEditionElement) => {
        userCoEditionElement.remove();
      });
      for (const key in coEdits) {
        if (key)
          for (const coEdit of coEdits[key]) {
            if (coEdit.infoType === 'TOC_INFO') return;
            const elemInDoc = this.document.getElementById(coEdit.elementId);
            this.addCoEditionIconToElement(elemInDoc, key, coEdits);
          }
      }
    }

    private addCoEditionIconToElement(elemToAddIcon: any, key: string, coEdits: Record<string, CoEditionVO[]>){
      const coEditNode = this.document.createElement('div');
      coEditNode.classList.add(
        'leos-user-coedition',
        'leos-user-coedition-self-user',
      );
      const iconSpan = this.document.createElement('span');
      iconSpan.classList.add('eui-icon', 'eui-icon-person');
      iconSpan.style.verticalAlign = 'bottom';
      iconSpan.style.display = 'inline-block';
      const textDiv = this.document.createElement('div');
      textDiv.innerHTML = this.generateTooltip(coEdits[key]);
      coEditNode.append(iconSpan);
      coEditNode.append(textDiv);
      coEditNode.style.top = elemToAddIcon.offsetTop + 'px';
      coEditNode.style.left =  (elemToAddIcon.offsetLeft - 25) + 'px';
      coEditNode.style.position = 'absolute';
      elemToAddIcon.insertAdjacentElement('beforebegin', coEditNode);
      coEditNode.addEventListener('mouseenter', () => {
        textDiv.style.left = iconSpan.offsetLeft + 10 + 'px';
        textDiv.style.display = 'block';
      });
      coEditNode.addEventListener('mouseleave', () => {
        textDiv.style.display = 'none';
      });
    }

    generateTooltip(coEdits: CoEditionVO[]) {
        if (!coEdits) return;
        let target = '';
        // FIXME: use translated message for target
        coEdits.forEach(
          (c) =>
            (target =
              target +
              `${c.userName} editing since ${formatDate(
                c.editionTime,
                'dd/MM/yyyy HH:mm',
                'en-US',
              )} <br>`),
        );
        return target;
      }
}
