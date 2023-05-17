import { HttpClient } from '@angular/common/http';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged, filter, take, tap, withLatestFrom } from 'rxjs';

import { EditElementResponse } from '@/features/akn-document/models/ckeditor';
import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { CoEditionDetectedDialogComponent } from '@/shared/components/co-edition-detected-dialog/co-edition-detected-dialog.component';
import {
  DocumentViewResponse,
  RefreshElementResponse,
} from '@/shared/models/document-view-response.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';

import { apiBaseUrl } from '../../../../config';
import { TableOfContentService } from './tableOfContent.service';

export type LeosEditorConnectorState = LeosJavaScriptExtensionState & {
  // No connector specific state
};

export type LeosEditorConnectorInitialState = Omit<
  LeosEditorConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type LeosEditorConnectorOptions = {
  rootElement: HTMLElement;
};

export class LeosEditorConnector extends AbstractJavaScriptComponent<LeosJavaScriptExtensionState> {
  // set in elementEditor.js
  editElement?: (
    elementId: any,
    elementType: any,
    elementFragment: any,
    docType: any,
    instanceType: any,
    alternatives: any,
    levelItemVo: any,
    isClonedProposal: any,
  ) => void;
  refreshElement?: (
    elementId: any,
    elementType: any,
    elementFragment: any,
  ) => void;
  receiveElement?: (
    elementId: any,
    elementType: any,
    elementFragment: any,
    documentRef: any,
  ) => void;
  receiveToc?: (tocWrapper: any) => void;
  receiveRefLabel?: (references: any, documentRef: any) => void;
  closeElement?: () => void;

  private elementUnderEdit = null;
  private isElementSaved = false;

  constructor(
    state: LeosEditorConnectorInitialState,
    private options: LeosEditorConnectorOptions,
    private http: HttpClient,
    private documentService: DocumentService,
    private coEditionService: CoEditionServiceWS,
    private dialogService: EuiDialogService,
    private translateService: TranslateService,
    private tableOfContentService: TableOfContentService,
  ) {
    super({ ...staticExtensionState, ...state }, options.rootElement);
  }
  //leosEditorExtension > requestToc
  requestToc(...args) {
    this.requestTocAndAncestors([]);
  }

  // leosEditorExtension > actionHandler
  editElementAction(data: {
    action: string;
    elementId: string;
    elementType: string;
  }) {
    const promise = new Promise<void>((resolve, reject) => {
      this.documentService.didDocumentLoadAndRender$
        .pipe(
          tap((loaded) => console.log('document loading : ', loaded)),
          filter((isLoaded) => isLoaded === true),
        )
        .subscribe((loaded) => {
          console.log('document loaded from observable');
          resolve();
        });
    });

    promise
      .then(() => {
        console.log('sucessfult handled edit', data);
        this.handleEdit(data);
      })
      .catch((error) => {
        console.log('handleEdit failed:', error);
      });
  }

  handleEdit(data: { action: string; elementId: string; elementType: string }) {
    const documentRef = this.documentService.documentRef;
    const documentType = this.documentService.documentType;
    this.elementUnderEdit = data.elementId;
    if (
      this.coEditionService.checkForCoEdition(
        'EDIT_ELEMENT',
        documentRef,
        data.elementId,
      )
    ) {
      this.dialogService.openDialog({
        title: this.translateService.instant(
          'page.editor.co-edition-detected.title',
        ),
        bodyComponent: {
          component: CoEditionDetectedDialogComponent,
        },
        accept: () => {
          this.getDocumentElement(
            documentRef,
            data.elementId,
            data.elementType.toLowerCase(),
            documentType,
          )
            .pipe(distinctUntilChanged())
            .subscribe((response) => {
              //TODO this will be removed after correct implementation of calls to get docType,instanceType, alternatives and isClonedProposal
              // this.connector.getState(false).user = response.user;
              // this.connector.getState(false).permissions =
              // response.permissions;
              this.editElement(
                response.elementId,
                response.elementTagName,
                response.element,
                documentType,
                process.env.NG_APP_LEOS_INSTANCE === 'cn'
                  ? 'COUNCIL'
                  : 'COMISSION',
                response.alternatives,
                JSON.stringify(response.levelItem),
                false,
              );
              this.coEditionService.joinElementCoEditInfo(
                documentRef,
                response.elementId,
              );
            });
        },
        dismiss: () => {
          // this.connector.releaseElement();
          // TODO: should probably also call this.actionManagerConnector?.cancelActionElement(elementId);
        },
      });
    } else {
      this.getDocumentElement(
        documentRef,
        data.elementId,
        data.elementType.toLowerCase(),
        documentType,
      )
        .pipe(distinctUntilChanged())
        .subscribe((response) => {
          //TODO this will be removed after correct implementation of calls to get docType,instanceType, alternatives and isClonedProposal
          this.editElement(
            response.elementId,
            response.elementTagName,
            response.element,
            documentType,
            process.env.NG_APP_LEOS_INSTANCE,
            response.alternatives,
            JSON.stringify(response.levelItem),
            false,
          );
          this.coEditionService.joinElementCoEditInfo(
            documentRef,
            response.elementId,
          );
        });
    }
  }

  // leosEditorExtension > elementEditor
  // checkboxesExtension (FinancialStatement screen)
  saveElement(elemData: {
    elementId: string;
    elementType: string;
    elementFragment: string;
    isSplit: boolean;
  }) {
    //! this is needed
    this.documentService.setDidDocumentLoadAndRender(false);
    const documentRef = this.documentService.documentRef;
    const documentType = this.documentService.documentType;
    this.saveDocumentElement(
      documentRef,
      elemData.elementId,
      elemData.elementType,
      elemData.elementFragment,
      elemData.isSplit,
      documentType,
    ).subscribe((response) => {
      this.isElementSaved = true;
      this.tableOfContentService.reload();
      this.coEditionService.sendUpdateDocumentEvent(documentRef);
      this.refreshElement(
        response.elementId,
        response.elementTagName,
        response.elementFragment,
      );
      this.documentService.reloadDocument();
    });
  }

  // leosEditorExtension > elementEditor
  releaseElement() {
    this.coEditionService.removeElementCoEditInfo(
      this.documentService.documentRef,
      this.elementUnderEdit,
    );
    if (!this.isElementSaved) {
      //   this.documentService.reloadDocument();
      // } else {
      this.documentService.resetDocument();
    }
    this.isElementSaved = false;
  }

  // leosEditorExtension > actionHandler
  deleteElementAction(elementData: {
    action: string;
    elementId: string;
    elementType: string;
  }) {
    const documentRef = this.documentService.documentRef;
    const documentType = this.documentService.documentType;
    this.deleteDocumentElement(
      documentRef,
      elementData.elementType.toLowerCase(),
      elementData.elementId,
      documentType,
    ).subscribe((response) => {
      this.documentService.setDocumentRefAndCategory(documentRef, documentType);
    });
  }

  // leosEditorExtension > actionHandler
  insertElementAction(elementData: {
    action: string;
    elementId: string;
    elementType: string;
    position: string;
  }) {
    const documentRef = this.documentService.documentRef;
    const documentType = this.documentService.documentType;
    this.insertDocumentElement(
      documentRef,
      elementData.elementType.toLowerCase(),
      elementData.elementId,
      documentType,
      elementData.position,
    )
      .pipe(distinctUntilChanged())
      .subscribe((response) => {
        this.documentService.setDocumentRefAndCategory(
          documentRef,
          documentType,
        );
        this.tableOfContentService.reloadToc();
      });
  }

  // leosEditorExtension > elementEditor
  mergeElement(elementData: {
    elementId: string;
    elementType: string;
    elementContent: string;
  }) {
    const documentRef = this.documentService.documentRef;
    const documentType = this.documentService.documentType;
    this.mergeDocumentElement(
      documentRef,
      documentType,
      elementData.elementId,
      elementData.elementType,
      elementData.elementContent,
    );
  }

  private requestTocAndAncestors(elementdIds) {
    this.documentService
      .fetchTocAndAncestors(elementdIds)
      .pipe(take(1))
      .subscribe((response) => {
        this.receiveToc(JSON.stringify(response));
      });
  }

  // called from this.saveElement
  private saveDocumentElement(
    documentRef: string,
    elementId: string,
    elementType: string,
    elementFragment: string,
    isSplit: boolean,
    documentType: string,
  ) {
    return this.http.put<RefreshElementResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementType}/${elementId}/save-element`,
      elementFragment,
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }

  // called from this.editElementAction > dialog accept
  private getDocumentElement(
    documentRef: string,
    elementId: string,
    elementName: string,
    documentType: string,
  ) {
    if (elementName === 'blockcontainer') elementName = 'blockContainer';
    return this.http.get<EditElementResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementId}/${elementName}`,
    );
  }

  // called from this.deleteElementAction
  private deleteDocumentElement(
    documentRef: string,
    elementName: string,
    elementId: string,
    documentType: string,
  ) {
    return this.http.delete<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementName}/${elementId}`,
    );
  }

  // called from this.insertElementAction
  private insertDocumentElement(
    documentRef: string,
    elementName: string,
    elementId: string,
    documentType: string,
    position: string,
  ) {
    return this.http.put<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementName}/${elementId}/insert-element`,
      { position: position.toUpperCase() },
    );
  }

  // called from this.mergeElement
  private mergeDocumentElement(
    documentRef: string,
    documentType: string,
    elementId: string,
    elementName: string,
    elementContent: string,
  ) {
    this.documentService.documentView$ = this.http.put<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementName}/${elementId}/merge-element`,
      { elementContent },
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
