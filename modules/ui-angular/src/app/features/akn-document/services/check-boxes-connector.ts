import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';

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
  private lastSaveElementTimestamp = 0;

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
    const currentTimestamp = Date.now();
    this.lastSaveElementTimestamp = currentTimestamp;

    const debounceCheckBoxChangeSave = new Subject<void>();

    debounceCheckBoxChangeSave
      .pipe(debounceTime(300), take(1))
      .subscribe(() => {
        if (this.lastSaveElementTimestamp === currentTimestamp) {
          this.documentService.setDidDocumentLoadAndRender(false);
          const documentRef = this.documentService.documentRef;
          const documentType = this.documentService.documentType;
          this.saveDocumentElement(
            documentRef,
            elemData.elementId,
            elemData.elementType,
            elemData.elementFragment,
            documentType,
          ).subscribe(() => {
            this.tableOfContentService.reload();
            this.coEditionService.sendUpdateDocumentEvent(documentRef);
            this.documentService.reloadDocument();
          });
        }
      });

    // Trigger the debouncer
    debounceCheckBoxChangeSave.next();
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
