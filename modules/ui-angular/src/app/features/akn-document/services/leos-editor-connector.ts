import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, distinctUntilChanged, tap } from 'rxjs';

import { EditElementResponse } from '@/features/akn-document/models/ckeditor';
import { ActionManagerConnectorState } from '@/features/akn-document/services/action-manager-connector';
import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { CoEditionDetectedDialogComponent } from '@/shared/components/co-edition-detected-dialog/co-edition-detected-dialog.component';
import { DocumentViewResponse } from '@/shared/models/document-view-response.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';

import { apiBaseUrl } from '../../../../config';

export type LeosEditorConnectorState = LeosJavaScriptExtensionState & {
  // No connector specific state
};

export type LeosEditorConnectorInitialState = Omit<
  LeosEditorConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type LeosEditorConnectorOptions = {
  rootElement: HTMLElement;
  documentRef: string;
  documentType: string;
};

export class LeosEditorConnector extends AbstractJavaScriptComponent<LeosJavaScriptExtensionState> {
  editElement?: (...args: any[]) => void;
  refreshElement?: (...args: any[]) => void;

  private documentRef: string;
  private documentType: string;
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
  ) {
    super({ ...staticExtensionState, ...state }, options.rootElement);
    this.documentRef = options.documentRef;
    this.documentType = options.documentType;
  }

  ///////
  // leosEditorExtension > actionHandler
  editElementAction(data: {
    action: string;
    elementId: string;
    elementType: string;
  }) {
    const documentRef = this.documentRef;
    const documentType = this.documentType;
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
    const documentRef = this.documentRef;
    const documentType = this.documentType;
    this.saveDocumentElement(
      documentRef,
      elemData.elementId,
      elemData.elementType,
      elemData.elementFragment,
      elemData.isSplit,
      documentType,
    ).subscribe((response) => {
      this.isElementSaved = true;
      this.coEditionService.sendUpdateDocumentEvent(documentRef);
      this.refreshElement(
        elemData.elementId,
        elemData.elementType,
        elemData.elementFragment,
      );
    });
  }
  // leosEditorExtension > elementEditor
  releaseElement() {
    const documentRef = this.documentRef;
    this.coEditionService.removeElementCoEditInfo(
      documentRef,
      this.elementUnderEdit,
    );
    if (this.isElementSaved) {
      this.documentService.reloadDocument();
    } else {
      this.documentService.resetDocument();
    }
  }

  // leosEditorExtension > actionHandler
  deleteElementAction(elementData: {
    action: string;
    elementId: string;
    elementType: string;
  }) {
    const documentRef = this.documentRef;
    const documentType = this.documentType;
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
    const documentRef = this.documentRef;
    const documentType = this.documentType;
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
        this.documentService.getToc(documentRef);
      });
  }

  // leosEditorExtension > elementEditor
  mergeElement(elementData: {
    elementId: string;
    elementType: string;
    elementContent: string;
  }) {
    const documentRef = this.documentRef;
    const documentType = this.documentType;
    this.mergeDocumentElement(
      documentRef,
      documentType,
      elementData.elementId,
      elementData.elementType,
      elementData.elementContent,
    );
  }

  // called from this.connector.saveElement
  private saveDocumentElement(
    documentRef: string,
    elementId: string,
    elementType: string,
    elementFragment: string,
    isSplit: boolean,
    documentType: string,
  ) {
    return this.http
      .put<DocumentViewResponse>(
        `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementType}/${elementId}/save-element`,
        elementFragment,
        { headers: { contentType: 'text' } },
      )
      .pipe(
        tap(() => {
          this.documentService.getToc(this.documentRef);
        }),
      );
  }

  // called from this.connector.editElementAction > dialog accept
  private getDocumentElement(
    documentRef: string,
    elementName: string,
    elementId: string,
    documentType: string,
  ) {
    return this.http.get<EditElementResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementName}/${elementId}`,
    );
  }

  // called from this.connector.deleteElementAction
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

  // called from this.connector.insertElementAction
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

  // called from this.connector.mergeElement
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
