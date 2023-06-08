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
import { findNodeById, isNodeLastElement } from '@/shared/utils/toc.utils';

import { apiBaseUrl } from '../../../../config';
import { TableOfContentService } from './tableOfContent.service';

export type LeosEditorConnectorState = LeosJavaScriptExtensionState & {
  // No connector specific state
  documentRef?: string;
  isAngularUI?: boolean;
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
    super(
      {
        ...staticExtensionState,
        documentRef: documentService.documentRef,
        isAngularUI: true,
        ...state,
      },
      options.rootElement,
    );
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
        .pipe(filter((isLoaded) => isLoaded === true))
        .subscribe((loaded) => {
          resolve();
        });
    });

    promise.then(() => {
      this.handleEdit(data);
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
              this.getState()['user'] = response.user;
              this.getState()['permissions'] =
                this.documentService.getUserPermissions();
              this.editElement(
                response.elementId,
                response.elementTagName,
                response.element,
                documentType.toUpperCase(),
                process.env.NG_APP_LEOS_INSTANCE === 'cn'
                  ? 'COUNCIL'
                  : 'COMISSION',
                response.alternatives,
                JSON.stringify(response.levelItem),
                response.clonedProposal,
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
          this.getState()['user'] = response.user;
          this.getState()['permissions'] =
            this.documentService.getUserPermissions();
          this.editElement(
            response.elementId,
            response.elementTagName,
            response.element,
            documentType.toUpperCase(),
            'OS',
            response.alternatives,
            JSON.stringify(response.levelItem),
            response.clonedProposal,
          );
          this.coEditionService.joinElementCoEditInfo(
            documentRef,
            response.elementId,
          );
        });
    }
  }

  requestRefLabel(data: {
    references: string[];
    currentEditPosition: string;
    capital: boolean;
    documentRef: string;
  }) {
    this.documentService
      .fetchReferenceLabel(
        data.references,
        data.currentEditPosition ?? null,
        data.capital,
        data.documentRef,
      )
      .pipe(take(1))
      .subscribe((response) => {
        console.log(response);
        this.receiveRefLabel(response, data.documentRef);
      });
  }

  requestElement(data: {
    elementId: string;
    elementType: string;
    documentRef: string;
  }) {
    this.documentService
      .requestElement(
        data.elementId,
        data.elementType.toLowerCase(),
        data.documentRef,
      )
      .pipe(take(1))
      .subscribe((response) => {
        this.receiveElement(
          response.elementId,
          response.elementTagName,
          response.elementFragment,
          response.documentRef,
        );
      });
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

    const deleteDocumentElement = () =>
      this.deleteDocumentElement(
        documentRef,
        elementData.elementType.toLowerCase(),
        elementData.elementId,
        documentType,
      ).subscribe((response) => {
        this.documentService.setDocumentRefAndCategory(
          documentRef,
          documentType,
        );
        this.tableOfContentService.reloadToc();
      });

    if (
      elementData.elementType === 'recital' &&
      isNodeLastElement(
        this.tableOfContentService.getCurrentToc(),
        elementData.elementId,
      )
    ) {
      this.openLastRecitalDeleteConfirmation(deleteDocumentElement);
      return;
    }
    deleteDocumentElement();
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

  private openLastRecitalDeleteConfirmation(onConfirm: () => void) {
    this.dialogService.openDialog({
      title: this.translateService.instant(
        'page.editor.last-element-delete-confirmation.title',
      ),
      content: this.translateService.instant(
        'page.editor.last-element-delete-confirmation.message',
      ),
      acceptLabel: this.translateService.instant('global.actions.continue'),
      accept: onConfirm,
      dismiss: () => {},
    });
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
    if (elementName === 'docpurpose') elementName = 'docPurpose';
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
