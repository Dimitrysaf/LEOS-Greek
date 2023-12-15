import { HttpClient } from '@angular/common/http';

import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';
import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { RefreshElementResponse } from '@/shared/models/document-view-response.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';

import { apiBaseUrl } from '../../../../config';
import { BlockDocumentEditorService } from './block-document-editor.service';

export type DatePickerConnectorState = LeosJavaScriptExtensionState;

export type DatePickerConnectorInitialState = Omit<
  DatePickerConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type DatePickerConnectorOptions = {
  rootElement: HTMLElement;
};

export class DatePickerConnector extends AbstractJavaScriptComponent<DatePickerConnectorState> {
  constructor(
    state: DatePickerConnectorInitialState,
    private options: DatePickerConnectorOptions,
    private http: HttpClient,
    private documentService: DocumentService,
    private tableOfContentService: TableOfContentService,
    private coEditionService: CoEditionServiceWS,
    private blockDocumentEditorService: BlockDocumentEditorService,
  ) {
    super({ ...staticExtensionState, ...state }, options.rootElement);
  }

  saveDocument(elemData: {
    elementId: string;
    elementType: string;
    elementFragment: string;
  }) {
    this.blockDocumentEditorService.setIsDocumentEditorBlocked(true);
    this.documentService.setDidDocumentLoadAndRender(false);
    const documentRef = this.documentService.documentRef;
    const documentType = this.documentService.documentType;
    this.saveDocumentElement(
      documentRef,
      elemData.elementId,
      elemData.elementType,
      elemData.elementFragment,
      documentType,
    ).subscribe((response) => {
      this.coEditionService.sendUpdateDocumentEvent(
        documentRef,
        elemData.elementId,
        elemData.elementType,
        elemData.elementFragment
      );
      this.documentService.reloadConnectors(elemData);
      this.blockDocumentEditorService.setIsDocumentEditorBlocked(false);
    });
  }

  private saveDocumentElement(
    documentRef: string,
    elementId: string,
    elementType: string,
    elementFragment: string,
    documentType: string,
  ) {
    elementFragment = elementFragment.replaceAll('id', 'xml:id');
    return this.http.put<RefreshElementResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementType}/${elementId}/save-element?isSplit=false`,
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
