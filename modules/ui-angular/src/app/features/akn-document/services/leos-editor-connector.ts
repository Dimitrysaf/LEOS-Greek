import { HttpClient } from '@angular/common/http';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { distinctUntilChanged, filter, finalize, take } from 'rxjs';

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
  }) {
    this.elementToEditAfterClose = null;
    const promise = new Promise<void>((resolve, reject) => {
      this.documentService.didDocumentLoadAndRender$
        .pipe(filter((isLoaded) => isLoaded === true))
        .subscribe((loaded) => {
          resolve();
        });
    });

    promise.then(() => {
      if (data.elementType === 'crossheading') {
        data.elementType = 'crossHeading';
      }

      setTimeout(() => {
        this.handleEdit(data);
      }, 1000);
    });
  }

  handleEdit(data: { action: string; elementId: string; elementType: string }) {
    const documentRef = this.documentService.documentRef;
    const documentType = this.documentService.documentType;
    this.elementUnderEdit = data.elementId;
    this.documentService.setIsEditorOpen(true);
    const isCNInstance = process.env.NG_APP_LEOS_INSTANCE === 'cn';
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
                  .subscribe((data) => {
                    this.editElement(
                      response.elementId,
                      response.elementTagName,
                      data.elementFragment,
                      documentType.toUpperCase(),
                      getInstanceType(process.env.NG_APP_LEOS_INSTANCE),
                      response.alternatives,
                      JSON.stringify(response.levelItem),
                      response.clonedProposal,
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
                );
              }
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
          this.setEditorOpenState('OPEN');
          if (!this.isCNInstance) {
            this.documentService
              .getElementContent(data.elementId, data.elementType)
              .subscribe((data) => {
                this.editElement(
                  response.elementId,
                  response.elementTagName,
                  data.elementFragment,
                  documentType.toUpperCase(),
                  getInstanceType(process.env.NG_APP_LEOS_INSTANCE),
                  response.alternatives,
                  JSON.stringify(response.levelItem),
                  response.clonedProposal,
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
    if (!this.isSaveAndClose && !this.documentService.isReloadRequired) {
      this.documentService.isReloadRequired = true;
    }
    this.documentService.setDidDocumentLoadAndRender(false);
    if (!this.isCNInstance) {
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
      if (!response.splittedContentIsEmpty) {
        this.closeElement();
      }
    });
  }

  private handleActionsAfterSave(
    response: RefreshElementResponse,
    elemData: SaveElementAction,
    taskId: string,
  ) {
    this.isElementSaved = true;
    this.elementToEditAfterClose = response.elementToEditAfterClose;
    if (this.isCNInstance) {
      this.refreshElement(
        response.elementId,
        response.elementTagName,
        response.elementFragment,
      );
      if (elemData.isSaveAndClose) {
        this.documentService.reloadDocument();
      }
    }
    this.updateTitleWithResponse(response);
    this.coEditionService.setShouldReloadAfterUpdate();
    this.documentService.updateElementContent({
      elementId: response.elementId,
      elementType: response.elementTagName,
      elementFragment: response.elementFragment,
    });
    this.loadingService.setTaskOver('saving', taskId);
  }

  updateTitleWithResponse(response: any): void {
    const updatedTitle = response.updatedTitle;
    if (updatedTitle) {
      this.documentService.updateTitle(updatedTitle);
      console.log(`Title updated to: ${updatedTitle}`);
    }
  }

  // leosEditorExtension > elementEditor
  releaseElement(elemData: {
    elementId: string;
    elementType: string;
    elementFragment: string;
  }) {
    const isCNInstance = process.env.NG_APP_LEOS_INSTANCE === 'cn';
    this.coEditionService.removeElementCoEditInfo(
      this.documentService.documentRef,
      this.elementUnderEdit,
    );
    if (isCNInstance) {
      if (this.isElementSaved && !this.isSaveAndClose) {
        this.documentService.reloadDocument();
      } else {
        this.documentService.resetDocument();
      }
    } else if (this.documentService.isReloadRequired) {
      this.documentService.reloadDocument();
    }
    this.setEditorOpenState('CLOSE');
    this.documentService.setIsEditorOpen(false);
    this.isElementSaved = false;
    this.documentService.isReloadRequired = false;
    if (this.elementToEditAfterClose && this.elementToEditAfterClose !== null) {
      this.editElementAction({
        action: 'edit',
        elementId: this.elementToEditAfterClose['elementId'],
        elementType: this.elementToEditAfterClose['elementTagName'],
      });
    }
  }

  // leosEditorExtension > actionHandler
  deleteElementAction(elementData: {
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
