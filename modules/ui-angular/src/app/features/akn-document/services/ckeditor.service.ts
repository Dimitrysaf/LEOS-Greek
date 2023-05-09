/* eslint-disable @typescript-eslint/member-ordering */
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash-es';
import {
  BehaviorSubject,
  combineLatest,
  combineLatestWith,
  filter,
  mergeMap,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { apiBaseUrl } from 'src/config';

import { AppConfigService } from '@/core/services/app-config.service';
import { ActionManagerConnector } from '@/features/akn-document/services/action-manager-connector';
import { ChangeDetailsConnector } from '@/features/akn-document/services/change-details-connector';
import { LeosEditorConnector } from '@/features/akn-document/services/leos-editor-connector';
import { RefToLinkConnector } from '@/features/akn-document/services/ref-to-link-connector';
import { SoftActionsConnector } from '@/features/akn-document/services/soft-actions-connector';
import { UserGuidanceConnector } from '@/features/akn-document/services/user-guidance-connector';
import { Require } from '@/features/leos-legacy/models/requirejs';
import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';
import { DocumentConfig, LeosConfig } from '@/shared/models';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';

@Injectable()
export class CKEditorService implements OnDestroy {
  private documentRefBS = new BehaviorSubject<string>(null);
  private documentTypeBS = new BehaviorSubject<string>(null);

  private actionManagerConnector?: ActionManagerConnector;
  private leosEditorConnector?: LeosEditorConnector;
  private userGuidanceConnector?: UserGuidanceConnector;
  private changeDetailsConnector?: ChangeDetailsConnector;
  private refToLinkConnector?: RefToLinkConnector;
  private softActionsConnector?: SoftActionsConnector;

  private destroy$ = new Subject<void>();
  private leosStateBS = new BehaviorSubject<any | null>(null);
  private leosState$ = this.leosStateBS.pipe(
    takeUntil(this.destroy$),
    filter(Boolean),
  );

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
    this.leosEditorConnector.destroy();
    this.actionManagerConnector.destroy();
    this.userGuidanceConnector.destroy();
    this.softActionsConnector.destroy();
    this.changeDetailsConnector.destroy();
    this.refToLinkConnector.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  init() {
    // TODO: this should not be hardcoded
    const rootElement = this.domDocument.getElementById('docContainer');

    combineLatest([this.leosLegacyService.require$, this.leosState$])
      .pipe(take(1))
      .subscribe(([require, leosState]) => {
        require(['js/leosModulesBootstrap']);
        this.initActionManager(require, leosState, rootElement);
        this.initLeosEditor(require, leosState, rootElement);
        this.initUserGuideance(require, leosState, rootElement);
        this.initChangeDetails(require, leosState, rootElement);
        this.initRefToLink(require, leosState, rootElement);
        this.initSoftActions(require, leosState, rootElement);
      });
  }

  private initActionManager(
    require: Require,
    leosState: any,
    rootElement: HTMLElement,
  ) {
    this.actionManagerConnector = new ActionManagerConnector(
      {
        instanceType: process.env.NG_APP_LEOS_INSTANCE,
        tocItemsJsonArray: leosState.tocItemsJsonArray,
      },
      { rootElement },
    );

    require(['extension/actionManagerExtension'], (actionManager) => {
      actionManager.init(this.actionManagerConnector);
    });
  }

  private initLeosEditor(
    require: Require,
    leosState: any,
    rootElement: HTMLElement,
  ) {
    this.leosEditorConnector = new LeosEditorConnector(
      //TODO pass only required state
      leosState,
      {
        rootElement,
        documentRef: this.documentRefBS.value,
        documentType: this.documentTypeBS.value,
      },
      this.http,
      this.documentService,
      this.coEditionService,
      this.dialogService,
      this.translateService,
    );
    require(['js/editor/leosEditorExtension'], (leosEditor) => {
      leosEditor.init(this.leosEditorConnector);
    });
  }

  private initChangeDetails(
    require: Require,
    leosState: any,
    rootElement: HTMLElement,
  ) {
    this.changeDetailsConnector = new ChangeDetailsConnector(
      //TODO pass only required state
      leosState,
      {
        rootElement,
      },
    );
    require(['extension/changeDetailsExtension'], (changeDetails) => {
      changeDetails.init(this.changeDetailsConnector);
    });
  }

  private initUserGuideance(
    require: Require,
    leosState: any,
    rootElement: HTMLElement,
  ) {
    this.userGuidanceConnector = new UserGuidanceConnector(
      //TODO pass only required state
      leosState,
      {
        rootElement,
      },
    );
    require(['extension/userGuidanceExtension'], (userGuideance) => {
      userGuideance.init(this.userGuidanceConnector);
    });
  }

  private initRefToLink(
    require: Require,
    leosState: any,
    rootElement: HTMLElement,
  ) {
    this.refToLinkConnector = new RefToLinkConnector(
      //TODO pass only required state
      leosState,
      {
        rootElement,
      },
    );
    require(['extension/userGuidanceExtension'], (userGuideance) => {
      userGuideance.init(this.refToLinkConnector);
    });
  }

  private initSoftActions(
    require: Require,
    leosState: any,
    rootElement: HTMLElement,
  ) {
    this.softActionsConnector = new SoftActionsConnector(
      //TODO pass only required state
      leosState,
      {
        rootElement,
      },
    );
    require(['extension/softActionsExtension'], (sofrActions) => {
      sofrActions.init(this.softActionsConnector);
    });
  }

  // called from document-editor.component
  setDocumentRef(documentRef: string) {
    this.documentRefBS.next(documentRef);
  }

  // called from document-editor.component
  setDocumentType(documentType: string) {
    this.documentTypeBS.next(documentType);
  }

  // called from annex-actions-dropdown.component.html
  toogleUserGuidance() {
    this.documentService.seeUserGuidance().subscribe((userGuidance) => {
      if (!userGuidance) {
        this.userGuidanceConnector.enableUserGuidance(false);
      } else {
        this.userGuidanceConnector.receiveUserGuidance(
          JSON.stringify(userGuidance),
        );
        this.userGuidanceConnector.enableUserGuidance(true);
      }
    });
  }

  // called from document-editor.component
  closeElementEditor() {
    this.leosEditorConnector?.closeElement();
  }

  // called from constructor
  private getConnectorExtraConfig() {
    return this.documentService.documentRefAndCategory$.pipe(
      takeUntil(this.destroy$),
      filter((x) => Boolean(x?.ref && x?.category)),
      switchMap((options) =>
        this.http.get<DocumentConfig>(
          `${apiBaseUrl}/secured/${
            options.category === 'coverpage' ? 'coverPage' : options.category
          }/${options.ref}/document-config`,
        ),
      ),
    );
  }

  // called from constructor
  private renameConfigKeysForEditor(config: any) {
    const oldConfig: LeosConfig & DocumentConfig = cloneDeep(config);
    const tocItems: any = cloneDeep(oldConfig.tocItems);

    tocItems.forEach((i) => {
      i.aknTag = i.aknTag.toLowerCase() as any;
      if (this.documentTypeBS.value === 'memorandum') {
        if (i.aknTag === 'main_body') {
          i.aknTag = 'mainBody';
        } else if (i.aknTag === 'block_container') {
          i.aknTag = 'blockContainer';
        }
      }
    });

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
}
