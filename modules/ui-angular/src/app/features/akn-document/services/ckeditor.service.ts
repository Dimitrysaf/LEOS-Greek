/* eslint-disable @typescript-eslint/member-ordering */
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  mergeMap,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { AppConfigService } from '@/core/services/app-config.service';
import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';
import { CoEditionDetectedDialogComponent } from '@/shared/components/co-edition-detected-dialog/co-edition-detected-dialog.component';
import { DocumentViewResponse } from '@/shared/models/document-view-response.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';

import { TocItem } from '../models/toc.model';

// FIXME: mockdata
// TODO This must be fetch from a backend Api. Keep in mind that aktTag must always be lowercase

const params = {
  elementId: '_body_level_1',
  elementType: 'level',
  elementFragment: `<level leos:depth="1" xml:id="_body_level_1">
                <num xml:id="_body_level_1_num">1.</num>
                <content xml:id="_body_level_1_content">
                    <p id="_body_level_1_content_p">Text...</p>
                </content>
            </level>`,
  docType: 'annex',
  instanceType: 'OS',
  alternatives: '',
  levelItemVo:
    '{"id":"_body_level_1","levelNum":"1.","levelDepth":1,"origin":null,"children":[{"id":"_body_level_1_1","levelNum":"1.1.","levelDepth":2,"origin":null,"children":[]}]}',
  isClonedProposal: false,
};
type ResizeListener<T extends Element = Element> = (event: {
  element: T;
}) => void;

@Injectable({
  providedIn: 'root',
})
export class CKEditorService implements OnDestroy {
  private annexRefBS = new BehaviorSubject<string>(null);
  private documentRefBS = new BehaviorSubject<string>(null);
  private xmlBS = new BehaviorSubject<string>('');
  private documentTypeBS = new BehaviorSubject<string>(null);
  private resizeObserver?: ResizeObserver;
  private elementEditAndSaveBS = new BehaviorSubject<any>({
    isEdited: false,
    isSaved: false,
  });
  resizeListeners = new Map<Element, Set<ResizeListener>>();
  elementEditor$: Observable<any>;
  xml$ = this.xmlBS.asObservable();
  documentRef$ = this.documentRefBS.asObservable();
  annexRef$ = this.annexRefBS.asObservable();
  documentType$ = this.documentTypeBS.asObservable();

  private elementUnderEdit = null;

  connector: any = {
    getParentId: () => 123,
    getElement: (...args) => document.getElementById('docContainer'),
    getState: () => ({
      ...this.leosStateBS.value,
      instanceType: process.env.NG_APP_LEOS_INSTANCE,
      alternateConfigsJsonArray: JSON.stringify('[]'),
    }),
    editElementAction: (data: {
      action: string;
      elementId: string;
      elementType: string;
    }) => {
      const documentRef = this.documentRefBS.value;
      const documentType = this.documentTypeBS.value;
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
                const { alternatives, isClonedProposal } = params;

                const res = JSON.parse(response);

                this.connector.editElement(
                  res.elementId,
                  res.elementTagName,
                  res.element,
                  documentType,
                  process.env.NG_APP_LEOS_INSTANCE,
                  alternatives,
                  JSON.stringify(res.levelItem),
                  isClonedProposal,
                );
                this.coEditionService.joinElementCoEditInfo(
                  documentRef,
                  res.elementId,
                );
              });
          },
          dismiss: () => {
            this.connector.releaseElement();
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
            const { alternatives, isClonedProposal } = params;

            const res = JSON.parse(response);

            this.connector.editElement(
              res.elementId,
              res.elementTagName,
              res.element,
              documentType,
              process.env.NG_APP_LEOS_INSTANCE,
              alternatives,
              JSON.stringify(res.levelItem),
              isClonedProposal,
            );
            this.coEditionService.joinElementCoEditInfo(
              documentRef,
              res.elementId,
            );
          });
      }
    },
    saveElement: (elemData: {
      elementId: string;
      elementType: string;
      elementFragment: string;
      isSplit: boolean;
    }) => {
      const documentRef = this.documentRefBS.value;
      const documentType = this.documentTypeBS.value;
      this.saveDocumentElement(
        documentRef,
        elemData.elementId,
        elemData.elementType,
        elemData.elementFragment,
        elemData.isSplit,
        documentType,
      ).subscribe((response) => {
        this.coEditionService.sendUpdateDocumentEvent(documentRef);
        this.connector.refreshElement(
          elemData.elementId,
          elemData.elementType,
          elemData.elementFragment,
        );
      });
    },
    closeElement: () => {},
    addResizeListener: <T extends Element>(
      element: T,
      callbackFunction: ResizeListener<T>,
    ) => {
      if (!this.resizeListeners.has(element)) {
        this.resizeListeners.set(element, new Set());
        this.getResizeObserver().observe(element);
      }
      this.resizeListeners.get(element).add(callbackFunction);
    },
    removeResizeListener: <T extends Element>(
      element: T,
      callbackFunction: ResizeListener<T>,
    ) => {
      if (this.resizeListeners.has(element)) {
        this.resizeListeners.get(element).delete(callbackFunction);
        if (this.resizeListeners.get(element).size === 0) {
          this.resizeListeners.delete(element);
          this.resizeObserver?.unobserve(element);
        }
      }
    },
    releaseElement: () => {
      const documentRef = this.documentRefBS.value;
      this.documentService.setDocumentId(documentRef);
      this.coEditionService.removeElementCoEditInfo(
        documentRef,
        this.elementUnderEdit,
      );
    },
    deleteElementAction: (elementData: {
      action: string;
      elementId: string;
      elementType: string;
    }) => {
      const documentRef = this.documentRefBS.value;
      const documentType = this.documentTypeBS.value;
      this.deleteDocumentElement(
        documentRef,
        elementData.elementType.toLowerCase(),
        elementData.elementId,
        documentType,
      ).subscribe((response) => {
        this.documentService.setDocumentId(documentRef);
      });
    },
    insertElementAction: (elementData: {
      action: string;
      elementId: string;
      elementType: string;
      position: string;
    }) => {
      const documentRef = this.documentRefBS.value;
      const documentType = this.documentTypeBS.value;
      this.insertDocumentElement(
        documentRef,
        elementData.elementType.toLowerCase(),
        elementData.elementId,
        documentType,
        elementData.position,
      )
        .pipe(distinctUntilChanged())
        .subscribe((response) => {
          this.documentService.setDocumentId(documentRef);
          this.documentService.getToc(documentRef);
        });
    },
    mergeElement: (elementData: {
      elementId: string;
      elementType: string;
      elementContent: string;
    }) => {
      const documentRef = this.documentRefBS.value;
      const documentType = this.documentTypeBS.value;
      this.mergeDocumentElement(
        documentRef,
        documentType,
        elementData.elementId,
        elementData.elementType,
        elementData.elementContent,
      );
    },
  };

  private destroy$ = new Subject<void>();
  private leosStateBS = new BehaviorSubject<any | null>(null);

  constructor(
    private leosLegacyService: LeosLegacyService,
    private http: HttpClient,
    private documentService: DocumentService,
    private appConfig: AppConfigService,
    private coEditionService: CoEditionServiceWS,
    private dialogService: EuiDialogService,
    private translateService: TranslateService,
    @Inject(DOCUMENT) private domDocument: Document,
  ) {
    this.appConfig.config
      .pipe(
        combineLatestWith(this.getConnectorExtraConfig()),
        mergeMap(([config, extraConfig]) => of({ ...config, ...extraConfig })),
      )
      .subscribe((c) => {
        this.renameConfigKeysForEditor(c);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  init() {
    this.leosLegacyService.require$.pipe(take(1)).subscribe((require) => {
      require(['js/leosModulesBootstrap']);
    });

    const actionManagerExtension$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['extension/actionManagerExtension'], (actionManager) => {
              subscriber.next(actionManager);
            });
          }),
      ),
    );
    const refToLinkExtension$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['extension/refToLinkExtension'], (refToLink) => {
              subscriber.next(refToLink);
            });
          }),
      ),
    );

    const leosEditorExtension$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['js/editor/leosEditorExtension'], (leosEditor) => {
              subscriber.next(leosEditor);
            });
          }),
      ),
    );

    const softActionsExtension$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['extension/softActionsExtension'], (softActions) => {
              subscriber.next(softActions);
            });
          }),
      ),
    );

    const changeDetailsExtension$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['extension/changeDetailsExtension'], (changeDetails) => {
              subscriber.next(changeDetails);
            });
          }),
      ),
    );

    const leosConfig$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['js/core/leosConfig'], (leosConfig) => {
              subscriber.next(leosConfig);
            });
          }),
      ),
    );

    const actionHandler$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['js/editor/core/actionHandler'], (actionHandler) => {
              subscriber.next(actionHandler);
            });
          }),
      ),
    );

    const toolbarPositionAdapter$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['js/editor/core/toolbarPositionAdapter'], (
              toolbarPositionAdapter,
            ) => {
              subscriber.next(toolbarPositionAdapter);
            });
          }),
      ),
    );

    const inlineLeosEditor$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require([
              'js/editor/plugins/leosInlineEditor/leosInlineEditorPlugin',
            ], (inlineLeosEditor) => {
              subscriber.next(inlineLeosEditor);
            });
          }),
      ),
    );

    const userGuidanceExtension$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['extension/userGuidanceExtension'], (userGuidance) => {
              subscriber.next(userGuidance);
            });
          }),
      ),
    );

    this.elementEditor$ = this.leosLegacyService.require$.pipe(
      switchMap(
        (require) =>
          new Observable((subscriber) => {
            require(['js/editor/core/elementEditor'], (elementEditor) => {
              subscriber.next(elementEditor);
            });
          }),
      ),
    );

    combineLatest([
      actionManagerExtension$,
      refToLinkExtension$,
      leosEditorExtension$,
      softActionsExtension$,
      changeDetailsExtension$,
      actionHandler$,
      toolbarPositionAdapter$,
      userGuidanceExtension$,
      this.elementEditor$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([
          actionManager,
          refTolink,
          leosEditor,
          softActions,
          changeDetails,
          actionHandler,
          toolbarPositionAdapter,
          userGuidanceExtension,
          elementEditor,
        ]: any[]) => {
          actionManager.init(this.connector);
          refTolink.init(this.connector);
          leosEditor.init(this.connector);
          softActions.init(this.connector);
          changeDetails.init(this.connector);
          actionHandler.setup(this.connector);
          toolbarPositionAdapter.setup(this.connector);
          userGuidanceExtension.init(this.connector);
          elementEditor.setup(this.connector);
        },
      );
  }

  saveDocumentElement(
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
          this.documentService.getToc(this.annexRefBS.value);
        }),
        // tap(() => this.connector.closeElement()),
      );
  }

  setXml(xml: string) {
    this.xmlBS.next(xml);
  }

  setDocumentRef(documentRef: string) {
    this.documentRefBS.next(documentRef);
  }

  setDocumentType(documentType: string) {
    this.documentTypeBS.next(documentType);
  }

  setAnnexRef(annexRef: string) {
    this.annexRefBS.next(annexRef);
  }

  getDocumentElement(
    documentRef: string,
    elementName: string,
    elementId: string,
    documentType: string,
  ) {
    return this.http.get(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementName}/${elementId}`,
      { responseType: 'text' },
    );
  }

  deleteDocumentElement(
    documentRef: string,
    elementName: string,
    elementId: string,
    documentType: string,
  ) {
    return this.http.delete<DocumentViewResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementName}/${elementId}`,
    );
  }

  insertDocumentElement(
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

  mergeDocumentElement(
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

  toogleUserGuidance() {
    this.documentService.seeUserGuidance().subscribe((userGuidance) => {
      if (!userGuidance) {
        this.connector.enableUserGuidance(false);
      } else {
        this.connector.receiveUserGuidance(JSON.stringify(userGuidance));
        this.connector.enableUserGuidance(true);
      }
    });
  }

  private getResizeObserver() {
    if (!this.resizeObserver) {
      const fireResizeListeners = (el: Element) =>
        this.resizeListeners.get(el)?.forEach((cb) => cb({ element: el }));
      const callback: ResizeObserverCallback = (entries) => {
        entries.map((e) => e.target).forEach(fireResizeListeners);
      };
      this.resizeObserver = new ResizeObserver(callback);
    }
    return this.resizeObserver;
  }

  private getConnectorExtraConfig() {
    return this.documentService.documentId$.pipe(
      takeUntil(this.destroy$),
      filter((x) => x !== null),
      combineLatestWith(this.documentService.documentCategory$),
      mergeMap(([documentRef, documentType]) =>
        this.http.get<any>(
          `${apiBaseUrl}/secured/${documentType}/${documentRef}/document-config`,
        ),
      ),
    );
  }

  private renameConfigKeysForEditor(config: any) {
    //toc-items
    Object.defineProperty(
      config,
      'tocItemsJsonArray',
      Object.getOwnPropertyDescriptor(config, 'tocItems'),
    );
    const tocArray = config.tocItems;
    config.tocItemsJsonArray = JSON.stringify(tocArray);
    delete config['tocItems'];

    //numberingConfigsJsonArray
    Object.defineProperty(
      config,
      'numberingConfigsJsonArray',
      Object.getOwnPropertyDescriptor(config, 'numberingConfig'),
    );
    const numConfigArray = config.numberingConfig;
    config.numberingConfigsJsonArray = JSON.stringify(numConfigArray);
    delete config['numberingConfig'];

    //listNumberConfigJsonArray
    const tmplistNumberConfigJsonArray = config.listNumberConfigJsonArray;
    config.listNumberConfigJsonArray = JSON.stringify(
      tmplistNumberConfigJsonArray,
    );

    //articleTypesConfig
    Object.defineProperty(
      config,
      'articleTypesConfigJsonArray',
      Object.getOwnPropertyDescriptor(config, 'articleTypesConfig'),
    );
    const articleTypesConfigObj = config.articleTypesConfig;
    config.articleTypesConfigJsonArray = JSON.stringify(articleTypesConfigObj);
    delete config['articleTypesConfig'];

    //documentsMetadata
    Object.defineProperty(
      config,
      'documentsMetadataJsonArray',
      Object.getOwnPropertyDescriptor(config, 'documentsMetadata'),
    );
    const documentsMetadataJsonArrayVal = config.documentsMetadata;
    config.documentsMetadataJsonArray = JSON.stringify(
      documentsMetadataJsonArrayVal,
    );
    delete config['documentsMetadata'];

    //implicitSaveEnabled

    Object.defineProperty(
      config,
      'isImplicitSaveEnabled',
      Object.getOwnPropertyDescriptor(config, 'implicitSaveAndClose'),
    );
    const implicitSaveAndCloseVal = config.implicitSaveAndClose;
    config.isImplicitSaveEnabled = JSON.stringify(implicitSaveAndCloseVal);
    delete config['implicitSaveAndClose'];

    //spellCheckerEnabled

    Object.defineProperty(
      config,
      'isSpellCheckerEnabled',
      Object.getOwnPropertyDescriptor(config, 'spellCheckerEnabled'),
    );
    const spellCheckerEnabledVal = config.spellCheckerEnabled;
    config.isSpellCheckerEnabled = JSON.stringify(spellCheckerEnabledVal);
    delete config['spellCheckerEnabled'];

    if (!config.spellCheckerServiceUrl) {
      config.spellCheckerServiceUrl =
        'https://webgate.acceptance.ec.testa.eu/qas/spellcheck';
    }

    if (!config.spellCheckerSourceUrl) {
      config.spellCheckerSourceUrl =
        'https://webgate.acceptance.ec.testa.eu/qas/static/wscbundle/wscbundle.js';
    }

    this.leosStateBS.next(config);
  }

  private setElementEditAndSave(
    isElementEdited: boolean,
    isElementSaved: boolean,
  ) {
    const payload = { isEdited: false, isSaved: false };
    payload.isEdited =
      isElementEdited !== null
        ? isElementEdited
        : this.elementEditAndSaveBS.value.isEdited;
    payload.isSaved =
      isElementSaved !== null
        ? isElementSaved
        : this.elementEditAndSaveBS.value.isSaved;
    this.elementEditAndSaveBS.next(payload);
  }
}
