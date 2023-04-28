/* eslint-disable @typescript-eslint/member-ordering */
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { clone, cloneDeep, setWith } from 'lodash-es';
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
import { DocumentConfig, LeosAppConfig, LeosConfig } from '@/shared/models';
import { DocumentViewResponse } from '@/shared/models/document-view-response.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';

import { EditElementResponse } from '../models/ckeditor';
import { TocItem } from '../models/toc.model';

// FIXME: mockdata
// TODO This must be fetch from a backend Api. Keep in mind that aktTag must always be lowercase

type ResizeListener<T extends Element = Element> = (event: {
  element: T;
}) => void;

@Injectable()
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
  private isElementSaved = false;
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
                this.connector.getState(false).user = response.user;
                this.connector.getState(false).permissions =
                  response.permissions;

                this.connector.editElement(
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

            this.connector.editElement(
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
        this.isElementSaved = true;
        this.coEditionService.sendUpdateDocumentEvent(documentRef);
        this.connector.refreshElement(
          elemData.elementId,
          elemData.elementType,
          elemData.elementFragment,
        );
      });
    },
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
      this.coEditionService.removeElementCoEditInfo(
        documentRef,
        this.elementUnderEdit,
      );
      if (this.isElementSaved) {
        this.documentService.reloadDocument();
      } else {
        this.documentService.resetDocument();
      }
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
        this.documentService.setDocumentRefAndCategory(
          documentRef,
          documentType,
        );
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
          this.documentService.setDocumentRefAndCategory(
            documentRef,
            documentType,
          );
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
      userGuidanceExtension$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([
          actionManager,
          refTolink,
          leosEditor,
          softActions,
          changeDetails,
          userGuidanceExtension,
        ]: any[]) => {
          actionManager.init(this.connector);
          refTolink.init(this.connector);
          leosEditor.init(this.connector);
          softActions.init(this.connector);
          changeDetails.init(this.connector);
          userGuidanceExtension.init(this.connector);
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
    return this.http.get<EditElementResponse>(
      `${apiBaseUrl}/secured/${documentType}/${documentRef}/element/${elementName}/${elementId}`,
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

  closeElementEditor() {
    this.connector.closeElement();
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
    return this.documentService.documentRefAndCategory$.pipe(
      takeUntil(this.destroy$),
      filter((x) => x !== null),
      switchMap((options) =>
        this.http.get<DocumentConfig>(
          `${apiBaseUrl}/secured/${
            options.category === 'coverpage' ? 'coverPage' : options.category
          }/${options.ref}/document-config`,
        ),
      ),
    );
  }

  private renameConfigKeysForEditor(config: any) {
    const oldConfig: LeosConfig & DocumentConfig = cloneDeep(config);
    const tocItems = cloneDeep(oldConfig.tocItems);
    tocItems.forEach((i) => (i.aknTag = i.aknTag.toLowerCase() as any));
    //toc-items
    Object.defineProperty(
      config,
      'tocItemsJsonArray',
      Object.getOwnPropertyDescriptor(config, 'tocItems'),
    );

    config.tocItemsJsonArray = JSON.stringify(tocItems);
    delete config['tocItems'];

    //numberingConfigsJsonArray
    Object.defineProperty(
      config,
      'numberingConfigsJsonArray',
      Object.getOwnPropertyDescriptor(config, 'numberingConfig'),
    );
    config.numberingConfigsJsonArray = JSON.stringify(
      oldConfig.numberingConfig,
    );
    delete config['numberingConfig'];

    config.listNumberConfigJsonArray = JSON.stringify(
      oldConfig.listNumberConfigJsonArray,
    );
    config.alternateConfigsJsonArray = JSON.stringify(
      oldConfig.alternateConfigs,
    );

    //articleTypesConfig
    Object.defineProperty(
      config,
      'articleTypesConfigJsonArray',
      Object.getOwnPropertyDescriptor(config, 'articleTypesConfig'),
    );
    config.articleTypesConfigJsonArray = JSON.stringify(
      oldConfig.articleTypesConfig,
    );
    delete config['articleTypesConfig'];

    //documentsMetadata
    Object.defineProperty(
      config,
      'documentsMetadataJsonArray',
      Object.getOwnPropertyDescriptor(config, 'documentsMetadata'),
    );
    config.documentsMetadataJsonArray = JSON.stringify(
      oldConfig.documentsMetadata,
    );
    delete config['documentsMetadata'];

    //implicitSaveEnabled

    Object.defineProperty(
      config,
      'isImplicitSaveEnabled',
      Object.getOwnPropertyDescriptor(config, 'implicitSaveAndClose'),
    );
    config.isImplicitSaveEnabled = JSON.stringify(
      oldConfig.implicitSaveAndClose,
    );
    delete config['implicitSaveAndClose'];

    Object.defineProperty(
      config,
      'isSpellCheckerEnabled',
      Object.getOwnPropertyDescriptor(config, 'spellCheckerEnabled'),
    );
    config.isSpellCheckerEnabled = JSON.stringify(
      oldConfig.spellCheckerEnabled,
    );
    delete config['spellCheckerEnabled'];

    if (!oldConfig.spellCheckerServiceUrl) {
      config.spellCheckerServiceUrl =
        'https://webgate.acceptance.ec.testa.eu/qas/spellcheck';
    }

    if (!oldConfig.spellCheckerSourceUrl) {
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
