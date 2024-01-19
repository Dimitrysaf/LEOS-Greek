import { HttpClient } from '@angular/common/http';
import { of, Subject, timer } from 'rxjs';
import {
  catchError,
  debounceTime,
  delay,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';
import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { RefreshElementResponse } from '@/shared/models/document-view-response.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';

import { apiBaseUrl } from '../../../../config';
import { BlockDocumentEditorService } from './block-document-editor.service';

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
  private cancelSaveElement$ = new Subject<void>();

  constructor(
    state: CheckBoxesConnectorInitialState,
    private options: CheckBoxesConnectorOptions,
    private http: HttpClient,
    private documentService: DocumentService,
    private tableOfContentService: TableOfContentService,
    private coEditionService: CoEditionServiceWS,
    private blockDocumentEdtiorService: BlockDocumentEditorService,
  ) {
    super({ ...staticExtensionState, ...state }, options.rootElement);
  }
  saveElement(elemData: {
    elementId: string;
    elementType: string;
    elementFragment: string;
  }) {
    this.cancelSaveElement$.next();
    this.blockDocumentEdtiorService.setIsDocumentEditorBlocked(true);

    this.documentService.setDidDocumentLoadAndRender(true);
    const documentRef = this.documentService.documentRef;
    const documentType = this.documentService.documentType;
    this.saveDocumentElement(
      documentRef,
      elemData.elementId,
      elemData.elementType,
      elemData.elementFragment,
      documentType,
    )
      .pipe(
        switchMap(() => {
          this.coEditionService.sendUpdateDocumentEvent(
            documentRef,
            elemData.elementId,
            elemData.elementType,
            elemData.elementFragment,
          );
          this.documentService.reloadConnectors(elemData);
          return of(null);
        }),
        takeUntil(this.cancelSaveElement$),
      )
      .subscribe(() => {
        this.blockDocumentEdtiorService.setIsDocumentEditorBlocked(false);
      });
  }

  private saveDocumentElement(
    documentRef: string,
    elementId: string,
    elementType: string,
    elementFragment: string,
    documentType: string,
  ) {
    const presenterId = this.coEditionService.presenterId;
    return this.http.put<RefreshElementResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementType}/${elementId}/save-element?isSplit=false`,
      elementFragment,
      { headers: { 'Content-Type': 'text/plain; charset=utf-8', presenterId } },
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
