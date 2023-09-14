import { HttpClient } from '@angular/common/http';
import { of, Subject, timer } from 'rxjs';
import {
  catchError,
  debounceTime,
  delay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';
import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { RefreshElementResponse } from '@/shared/models/document-view-response.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';

import { apiBaseUrl } from '../../../../config';

export type CheckBoxesConnectorState = LeosJavaScriptExtensionState & {
  checkBoxTagName: string;
  checkedBoxValue: string;
  uncheckedBoxValue: string;
  checkBoxAttributeName: string;
  checkedBoxAttribute: string;
  uncheckedBoxAttribute: string;
};

export type CheckBoxesConnectorInitialState = Omit<
  CheckBoxesConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type CheckBoxesConnectorOptions = {
  rootElement: HTMLElement;
};

export class CheckBoxesConnector extends AbstractJavaScriptComponent<CheckBoxesConnectorState> {
  private saveElementRequestQueue = [];
  private isRequestInProgress = false; // Flag to track if a request is in progress

  private readonly maxRetryDelay = 10000;

  constructor(
    state: CheckBoxesConnectorInitialState,
    private options: CheckBoxesConnectorOptions,
    private http: HttpClient,
    private documentService: DocumentService,
    private tableOfContentService: TableOfContentService,
    private coEditionService: CoEditionServiceWS,
  ) {
    super({ ...staticExtensionState, ...state }, options.rootElement);
  }

  saveElement(elemData: {
    elementId: string;
    elementType: string;
    elementFragment: string;
  }) {
    this.saveElementRequestQueue.push(elemData);

    if (!this.isRequestInProgress) {
      setTimeout(() => {
        if (!this.isRequestInProgress) {
          this.processQueue();
        }
      }, 1000);
    }
  }

  private processQueue() {
    const documentRef = this.documentService.documentRef;
    const documentType = this.documentService.documentType;
    this.documentService.setDidDocumentLoadAndRender(false);
    if (this.saveElementRequestQueue.length === 0) {
      this.isRequestInProgress = false;
      this.tableOfContentService.reload();
      this.coEditionService.sendUpdateDocumentEvent(documentRef);
      this.documentService.reloadDocument();
      return;
    }

    const nextRequest = this.saveElementRequestQueue.shift();

    this.isRequestInProgress = true;
    this.saveDocumentElement(
      documentRef,
      nextRequest.elementId,
      nextRequest.elementType,
      nextRequest.elementFragment,
      documentType,
    )
      .pipe(
        tap(() => {
          this.processQueue();
        }),
        catchError((error) => {
          if (error.status === 409) {
            return timer(0, 1000).pipe(
              take(10),
              delay(this.maxRetryDelay),
              switchMap(() =>
                of(
                  this.saveElement({
                    elementId: nextRequest.elementId,
                    elementType: nextRequest.elementType,
                    elementFragment: nextRequest.elementFragment,
                  }),
                ),
              ),
            );
          }
        }),
      )
      .subscribe(() => {
        this.isRequestInProgress = false;
      });
  }

  private saveDocumentElement(
    documentRef: string,
    elementId: string,
    elementType: string,
    elementFragment: string,
    documentType: string,
  ) {
    return this.http.put<RefreshElementResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementType}/${elementId}/save-element`,
      elementFragment,
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }
}

const staticExtensionState: LeosJavaScriptExtensionState = {
  callbackNames: [
    // FIXME: add missing callbacks
  ],
  rpcInterfaces: {
    'eu.europa.ec.leos.ui.shared.js.LeosJavaScriptServerRpc': [
      'clientJSDepsInited',
    ],
  },
  jsDepsInited: true,
  dirtyTimestamp: -1,
};
