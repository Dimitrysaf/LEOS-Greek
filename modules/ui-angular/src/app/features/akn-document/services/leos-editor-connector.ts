import { HttpClient } from '@angular/common/http';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged, filter, take } from 'rxjs';

import {
  EditElementResponse,
  SaveElementAction,
} from '@/features/akn-document/models/ckeditor';
import type { EditorOpenState } from '@/features/akn-document/services/ckeditor.service';
import { AbstractJavaScriptComponent } from '@/features/leos-legacy/abstract-java-script-component';
import { LeosJavaScriptExtensionState } from '@/features/leos-legacy/models';
import { CoEditionDetectedDialogComponent } from '@/shared/components/co-edition-detected-dialog/co-edition-detected-dialog.component';
import {
  DocumentViewResponse,
  RefreshElementResponse,
} from '@/shared/models/document-view-response.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';
import { EnvironmentService } from '@/shared/services/enviroment.service';
import { LoadingService } from '@/shared/services/loading.service';
import { getInstanceType, isNodeLastElement } from '@/shared/utils/toc.utils';

import { apiBaseUrl } from '../../../../config';
import { TableOfContentService } from './table-of-content.service';
import { ActionManagerConnector } from "@/features/akn-document/services/action-manager-connector";

export type LeosEditorConnectorState = LeosJavaScriptExtensionState & {
  // No connector specific state
  documentRef?: string;
  isAngularUI?: boolean;
  isTrackChangesShowed: boolean;
  isTrackChangesEnabled: boolean;
};

export type LeosEditorConnectorInitialState = Omit<
  LeosEditorConnectorState,
  keyof LeosJavaScriptExtensionState
>;

export type LeosEditorConnectorOptions = {
  rootElement: HTMLElement;
};

export class LeosEditorConnector extends AbstractJavaScriptComponent<LeosEditorConnectorState> {
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
    elementCursorId: any,
    elementCursorChildPos: any,
    elementCursorPos: any
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

  public isCNInstance;

  private elementUnderEdit = null;
  private isElementSaved = false;
  private isSaveAndClose = false;
  private elementToEditAfterClose: Element;

  constructor(
    state: LeosEditorConnectorInitialState,
    private options: LeosEditorConnectorOptions,
    private http: HttpClient,
    private documentService: DocumentService,
    private coEditionService: CoEditionServiceWS,
    private dialogService: EuiDialogService,
    private translateService: TranslateService,
    private tableOfContentService: TableOfContentService,
    private loadingService: LoadingService,
    private environmentService: EnvironmentService,
    private setEditorOpenState: (state: EditorOpenState) => void,
    private actionManagerConnector: ActionManagerConnector
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
    this.isCNInstance = this.environmentService.isCouncil();
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
    elementCursorId: string;
    elementCursorChildPos: number
    elementCursorPos: number;
  }) {
    this.elementToEditAfterClose = null;
    if (data.elementType === 'crossheading') {
      data.elementType = 'crossHeading';
    }

    if (this.isCNInstance) {
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
    } else {
      this.handleEdit(data);
    }
  }

  handleEdit(data: { action: string; elementId: string; elementType: string, elementCursorId: string, elementCursorChildPos: number, elementCursorPos: number }) {
    const documentRef = this.documentService.documentRef;
    const documentType = this.documentService.documentType;
    this.elementUnderEdit = data.elementId;
    this.documentService.setIsEditorOpen(true);
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
              this.setEditorOpenState('OPEN');
              if (!this.isCNInstance) {
                this.documentService
                  .getElementContent(data.elementId, data.elementType)
                  .subscribe((elemData) => {
                    this.editElement(
                      response.elementId,
                      response.elementTagName,
                      elemData.elementFragment,
                      documentType.toUpperCase(),
                      getInstanceType(process.env.NG_APP_LEOS_INSTANCE),
                      response.alternatives,
                      JSON.stringify(response.levelItem),
                      response.clonedProposal,
                      data.elementCursorId,
                      data.elementCursorChildPos,
                      data.elementCursorPos
                    );
                  });
              } else {
                this.editElement(
                  response.elementId,
                  response.elementTagName,
                  response.element,
                  documentType.toUpperCase(),
                  getInstanceType(process.env.NG_APP_LEOS_INSTANCE),
                  response.alternatives,
                  JSON.stringify(response.levelItem),
                  response.clonedProposal,
                  data.elementCursorId,
                  data.elementCursorChildPos,
                  data.elementCursorPos
                );
              }
              this.coEditionService.joinElementCoEditInfo(
                documentRef,
                response.elementId,
              );
            });
        },
        dismiss: () => {
          this.actionManagerConnector.cancelActionElement(data.elementId);
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
          this.setEditorOpenState('OPEN');
          if (!this.isCNInstance) {
            this.documentService
              .getElementContent(data.elementId, data.elementType)
              .subscribe((elemData) => {
                this.editElement(
                  response.elementId,
                  response.elementTagName,
                  elemData.elementFragment,
                  documentType.toUpperCase(),
                  getInstanceType(process.env.NG_APP_LEOS_INSTANCE),
                  response.alternatives,
                  JSON.stringify(response.levelItem),
                  response.clonedProposal,
                  data.elementCursorId,
                  data.elementCursorChildPos,
                  data.elementCursorPos
                );
              });
          } else {
            this.editElement(
              response.elementId,
              response.elementTagName,
              response.element,
              documentType.toUpperCase(),
              getInstanceType(process.env.NG_APP_LEOS_INSTANCE),
              response.alternatives,
              JSON.stringify(response.levelItem),
              response.clonedProposal,
              data.elementCursorId,
              data.elementCursorChildPos,
              data.elementCursorPos
            );
          }
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
        data.capital ?? false,
        data.documentRef,
      )
      .pipe(take(1))
      .subscribe((response) => {
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
  saveElement(elemData: SaveElementAction) {
    this.isSaveAndClose = elemData.isSaveAndClose;
    this.documentService.setDidDocumentLoadAndRender(false);
    this.isElementSaved = true;
    if (!elemData.isSplit) {
      this.refreshElement(
        elemData.elementId,
        elemData.elementType,
        elemData.elementFragment,
      );
    }
    const milliseconds = new Date().getTime();
    this.loadingService.setTaskOngoing('saving', String(milliseconds));
    this.saveDocumentElement(
      this.documentService.documentRef,
      elemData.elementId,
      elemData.elementType,
      elemData.elementFragment,
      elemData.isSplit,
      this.documentService.documentType,
      this.coEditionService.presenterId,
    ).subscribe((response) => {
      this.handleActionsAfterSave(response, elemData, String(milliseconds));
    });
  }

  private handleActionsAfterSave(
    response: RefreshElementResponse,
    elemData: SaveElementAction,
    taskId: string,
  ) {
    this.elementToEditAfterClose = response.elementToEditAfterClose;
    if (this.elementToEditAfterClose && this.elementToEditAfterClose !== null) {
      this.closeElement();
    }
    this.updateTitleWithResponse(response);
    this.coEditionService.setShouldReloadAfterUpdate();
    this.loadingService.setTaskOver('saving', taskId);
  }

  private updateTitleWithResponse(response: any): void {
    const updatedTitle = response.updatedTitle;
    if (updatedTitle) {
      this.documentService.updateTitle(updatedTitle);
    }
  }

  // leosEditorExtension > elementEditor
  private releaseElement(elemData: {
    elementId: string;
    elementType: string;
    elementFragment: string;
  }) {
    this.coEditionService.removeElementCoEditInfo(
      this.documentService.documentRef,
      this.elementUnderEdit,
    );
    if (!this.elementToEditAfterClose || this.elementToEditAfterClose == null) {
      this.documentService.reloadConnectors(elemData, true);
    }
    if (
      this.isCNInstance &&
      !this.isElementSaved &&
      (!this.elementToEditAfterClose || this.elementToEditAfterClose == null)
    ) {
      this.documentService.resetDocument();
    }
    this.setEditorOpenState('CLOSE');
    this.documentService.setIsEditorOpen(false);
    if (this.elementToEditAfterClose && this.elementToEditAfterClose !== null) {
      this.editElementAction({
        action: 'edit',
        elementId: this.elementToEditAfterClose['elementId'],
        elementType: this.elementToEditAfterClose['elementTagName'],
        elementCursorId: "",
        elementCursorChildPos: -1,
        elementCursorPos: -1
      });
    } else if (this.documentService.isReloadRequired) {
      if (!this.isElementSaved) {
        // When updates have been done on the same edited element by another user, if saved, other changes are screwed up.
        this.documentService.reloadDocument();
      }
      this.documentService.isReloadRequired = false;
    }
    this.isElementSaved = false;
  }

  // leosEditorExtension > actionHandler
  private deleteElementAction(elementData: {
    action: string;
    elementId: string;
    elementType: string;
  }) {
    const { elementType, elementId } = elementData;
    const isLastElement = isNodeLastElement(
      this.tableOfContentService.getCurrentToc(),
      elementId,
    );

    const confirmDeletion = () => {
      const documentRef = this.documentService.documentRef;
      const documentType = this.documentService.documentType;

      this.deleteDocumentElement(
        documentRef,
        elementType.toLowerCase(),
        elementId,
        documentType,
      ).subscribe((response) => {
        this.documentService.setDocumentRefAndCategory(
          documentRef,
          documentType,
        );
        this.tableOfContentService.reloadToc();
      });
    };

    if (
      (this.isCNInstance &&
        isLastElement &&
        ['recital', 'citation', 'body'].includes(elementType)) ||
      (!this.isCNInstance && isLastElement)
    ) {
      this.openLastElementDeleteConfirmation(confirmDeletion);
    } else {
      this.dialogService.openDialog({
        title: this.translateService.instant(
          'page.editor.element-delete-dialog.title',
        ),
        content: this.translateService.instant(
          'page.editor.element-delete-dialog.body',
        ),
        accept: confirmDeletion,
        dismiss: () =>
          this.releaseElement({
            elementId: elementData.elementId,
            elementType: elementData.elementType,
            elementFragment: null,
          }),
      });
    }
  }

  // leosEditorExtension > actionHandler
  private insertElementAction(elementData: {
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
  private mergeElement(elementData: {
    elementId: string;
    elementType: string;
    elementFragment: string;
  }) {
    const documentRef = this.documentService.documentRef;
    const documentType = this.documentService.documentType;
    this.mergeDocumentElement(
      documentRef,
      documentType,
      elementData.elementId,
      elementData.elementType,
      elementData.elementFragment,
    ).subscribe((response) => {
      this.closeElement();
      this.documentService.refreshView(response);
    });
  }

  private openLastElementDeleteConfirmation(onConfirm: () => void) {
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
    presenterId: string,
  ) {
    const cleanedHtml = this.cleanElementFromCoEditInfo(elementFragment);
    return this.http.put<RefreshElementResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementType}/${elementId}/save-element?isSplit=${isSplit}`,
      cleanedHtml,
      {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          presenterId,
        },
      },
    );
  }

  private cleanElementFromCoEditInfo(elementFragment: string) {
    const cleanedHtml = elementFragment.replace(/<div\b[^>]*>.*?<\/div>/, '');
    return cleanedHtml.replace('</div>', '');
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
    return this.http.put<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementName}/${elementId}/merge-element`,
      elementContent,
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }
}

// FIXME normally the above timeout should 1000 for the production env. Raised to 4000 to address acceptance env delays.
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
