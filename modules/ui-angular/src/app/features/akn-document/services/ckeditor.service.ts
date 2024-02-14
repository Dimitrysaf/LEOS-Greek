/* eslint-disable @typescript-eslint/member-ordering */
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash-es';
import { combineLatest, map, Subject, take, takeUntil } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { ActionManagerConnector } from '@/features/akn-document/services/action-manager-connector';
import { ChangeDetailsConnector } from '@/features/akn-document/services/change-details-connector';
import { LeosEditorConnector } from '@/features/akn-document/services/leos-editor-connector';
import { MathJaxConnector } from '@/features/akn-document/services/math-jax-connector';
import { MergeActionsService } from '@/features/akn-document/services/merge-actions.service';
import { MergeContributionsService } from '@/features/akn-document/services/merge-contributions.service';
import { RefToLinkConnector } from '@/features/akn-document/services/ref-to-link-connector';
import { SoftActionsConnector } from '@/features/akn-document/services/soft-actions-connector';
import { TrackChangesConnector } from '@/features/akn-document/services/track-changes-connector';
import { UserGuidanceConnector } from '@/features/akn-document/services/user-guidance-connector';
import { Require } from '@/features/leos-legacy/models/requirejs';
import { LeosLegacyService } from '@/features/leos-legacy/services/leos-legacy.service';
import { DocumentConfig } from '@/shared/models';
import { ContributionVO } from '@/shared/models/contribution-vo.model';
import { LeosAppConfig } from '@/shared/models/leos.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';
import { EnvironmentService } from '@/shared/services/enviroment.service';
import { LoadingService } from '@/shared/services/loading.service';

import { TocItem } from '../models/toc.model';
import { BlockDocumentEditorService } from './block-document-editor.service';
import { CheckBoxesConnector } from './check-boxes-connector';
import { DatePickerConnector } from './date-picker-connector';
import { MergeContributionConnector } from './merge-contribution-connector';
import { TableOfContentService } from './table-of-content.service';

export type EditorOpenState = 'OPEN' | 'CLOSE';

@Injectable()
export class CKEditorService implements OnDestroy {
  private actionManagerConnector?: ActionManagerConnector;
  private leosEditorConnector?: LeosEditorConnector;
  private userGuidanceConnector?: UserGuidanceConnector;
  private changeDetailsConnector?: ChangeDetailsConnector;
  private refToLinkConnector?: RefToLinkConnector;
  private softActionsConnector?: SoftActionsConnector;
  private mathJaxConnector?: MathJaxConnector;
  private trackChangesConnector?: TrackChangesConnector;
  private mergeContributionConnector?: MergeContributionConnector;
  private datePickerConnector?: DatePickerConnector;
  private checkBoxesConnector?: CheckBoxesConnector;

  private openStateSubj = new Subject<EditorOpenState>();
  private destroy$ = new Subject<void>();

  public openState$ = this.openStateSubj.asObservable();

  constructor(
    private leosLegacyService: LeosLegacyService,
    private http: HttpClient,
    private documentService: DocumentService,
    private appConfig: AppConfigService,
    private coEditionService: CoEditionServiceWS,
    private dialogService: EuiDialogService,
    private translateService: TranslateService,
    private tableOfContentService: TableOfContentService,
    private loadingService: LoadingService,
    private environmentService: EnvironmentService,
    @Inject(DOCUMENT) private domDocument: Document,
    private blockDocumentEditorService: BlockDocumentEditorService,
    private mergeActionsService: MergeActionsService,
    private mergeContributionService: MergeContributionsService,
  ) {}

  ngOnDestroy() {
    this.leosEditorConnector?.destroy();
    this.actionManagerConnector?.destroy();
    this.userGuidanceConnector?.destroy();
    this.softActionsConnector?.destroy();
    this.changeDetailsConnector?.destroy();
    this.refToLinkConnector?.destroy();
    this.mathJaxConnector?.destroy();
    this.trackChangesConnector?.destroy();
    this.mergeContributionConnector?.destroy();
    this.datePickerConnector?.destroy();
    this.checkBoxesConnector?.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  init() {
    // TODO: this should not be hardcoded
    const rootElement = this.domDocument.getElementById('docContainer');

    combineLatest([this.leosLegacyService.require$, this.getLeosState()])
      .pipe(take(1))
      .subscribe(([require, leosState]) => {
        require(['js/leosModulesBootstrap']);
        this.initActionManager(require, leosState, rootElement);
        this.initLeosEditor(require, leosState, rootElement);
        this.initUserGuidance(require, leosState, rootElement);
        this.initChangeDetails(require, leosState, rootElement);
        this.initRefToLink(require, leosState, rootElement);
        this.initSoftActions(require, leosState, rootElement);
        this.initMathJax(require, leosState, rootElement);
        this.initTrackChanges(require, leosState, rootElement);
        this.initMergeContribution(require, leosState, rootElement);
        if (this.documentService.documentType === 'stat_financ_legis') {
          this.initDatePicker(require, leosState, rootElement);
          this.initCheckBoxes(require, rootElement);
        }
      });

    this.documentService.documentView$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.refreshStateAllAvailableConnectors();
      });
  }

  refreshStateAllAvailableConnectors() {
    this.leosEditorConnector?.$triggerStateChange();
    this.actionManagerConnector?.$triggerStateChange();
    this.userGuidanceConnector?.$triggerStateChange();
    this.softActionsConnector?.$triggerStateChange();
    this.changeDetailsConnector?.$triggerStateChange();
    this.refToLinkConnector?.$triggerStateChange();
    this.mathJaxConnector?.$triggerStateChange();
    this.trackChangesConnector?.$triggerStateChange();
    this.mergeContributionConnector?.$triggerStateChange();
    if (this.datePickerConnector) {
      const rootElement = this.domDocument.getElementById('docContainer');
      combineLatest([this.leosLegacyService.require$, this.getLeosState()])
        .pipe(take(1))
        .subscribe(([require, leosState]) => {
          require(['js/leosModulesBootstrap']);
          this.initDatePicker(require, leosState, rootElement);
        });
    }
    this.datePickerConnector?.$triggerStateChange();
    this.checkBoxesConnector?.$triggerStateChange();
  }

  refreshStateSpecificConnectors() {
    this.refToLinkConnector?.$triggerStateChange();
    this.mathJaxConnector?.$triggerStateChange();
    this.trackChangesConnector?.$triggerStateChange();
  }

  triggerMergeContributionConnectorStateChange() {
    this.mergeContributionConnector.$triggerStateChange();
  }

  changeSeeTrackChangesState() {
    this.trackChangesConnector.getState().isTrackChangesShowed =
      !this.trackChangesConnector.getState().isTrackChangesShowed;
    this.leosEditorConnector.getState().isTrackChangesShowed =
      !this.leosEditorConnector.getState().isTrackChangesShowed;
    this.trackChangesConnector.$triggerStateChange();
    this.leosEditorConnector.$triggerStateChange();
  }

  changeEnableTrackChangesState(isTrackChangesEnabled) {
    this.leosEditorConnector.getState().isTrackChangesEnabled =
      isTrackChangesEnabled;
  }

  getSeeTrackChangesState() {
    return this.trackChangesConnector.getState().isTrackChangesShowed;
  }

  handleMergeContributionsActions(
    acceptAllContributions: boolean,
    contribution: ContributionVO,
  ) {
    this.mergeContributionConnector?.setAcceptAllContributions(
      acceptAllContributions,
    );
    this.mergeContributionConnector?.setContributionToMerge(contribution);
    this.mergeContributionConnector?.populateMergeActionList(
      acceptAllContributions,
    );
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
      this.actionManagerConnector.jsDepsInited();
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
      },
      this.http,
      this.documentService,
      this.coEditionService,
      this.dialogService,
      this.translateService,
      this.tableOfContentService,
      this.loadingService,
      this.environmentService,
      (state: EditorOpenState) => {
        this.openStateSubj.next(state);
      },
    );
    require(['js/editor/leosEditorExtension'], (leosEditor) => {
      leosEditor.init(this.leosEditorConnector);
      this.leosEditorConnector.jsDepsInited();
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
      this.changeDetailsConnector.jsDepsInited();
    });
  }

  private initUserGuidance(
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
      this.userGuidanceConnector.jsDepsInited();
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
    require(['extension/refToLinkExtension'], (refToLink) => {
      refToLink.init(this.refToLinkConnector);
      this.refToLinkConnector.jsDepsInited();
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
    require(['extension/softActionsExtension'], (softActions) => {
      softActions.init(this.softActionsConnector);
      this.softActionsConnector.jsDepsInited();
    });
  }

  private initMathJax(
    require: Require,
    leosState: any,
    rootElement: HTMLElement,
  ) {
    this.mathJaxConnector = new MathJaxConnector(leosState, {
      rootElement,
    });

    require(['extension/mathJaxExtension'], (mathJax) => {
      mathJax.init(this.mathJaxConnector);
      this.mathJaxConnector.jsDepsInited();
    });
  }

  private initTrackChanges(
    require: Require,
    leosState: any,
    rootElement: HTMLElement,
  ) {
    this.trackChangesConnector = new TrackChangesConnector(leosState, {
      rootElement,
    });

    require(['extension/trackChangesExtension'], (trackChanges) => {
      trackChanges.init(this.trackChangesConnector);
      this.trackChangesConnector.jsDepsInited();
    });
  }

  private initMergeContribution(
    require: Require,
    leosState: any,
    rootElement: HTMLElement,
  ) {
    this.mergeContributionService.contributions$.subscribe((contributions) => {
      if (contributions.length > 0) {
        this.mergeContributionConnector = new MergeContributionConnector(
          leosState,
          this.documentService,
          {
            rootElement,
          },
          this.mergeActionsService,
          this.mergeContributionService,
        );

        require(['extension/mergeContributionExtension'], (
          mergeContribution,
        ) => {
          mergeContribution.init(this.mergeContributionConnector);
          this.mergeContributionConnector.jsDepsInited();
        });
      }
    });
  }

  private initDatePicker(
    require: Require,
    leosState: any,
    rootElement: HTMLElement,
  ) {
    this.datePickerConnector = new DatePickerConnector(
      leosState,
      {
        rootElement,
      },
      this.http,
      this.documentService,
      this.tableOfContentService,
      this.coEditionService,
      this.blockDocumentEditorService,
    );

    require(['extension/datePickerExtension'], (datePicker) => {
      datePicker.init(this.datePickerConnector);
      this.datePickerConnector.jsDepsInited();
    });
  }

  private initCheckBoxes(require: Require, rootElement: HTMLElement) {
    // see modules/ui/src/main/java/eu/europa/ec/leos/ui/view/financialstatement/FinancialStatementScreenImpl.java
    this.checkBoxesConnector = new CheckBoxesConnector(
      {
        checkBoxTagName: 'indent',
        checkedBoxValue: '&#x2611;',
        uncheckedBoxValue: '&#x2610;',
        checkBoxAttributeName: 'name',
        checkedBoxAttribute: 'checked',
        uncheckedBoxAttribute: 'unchecked',
      },
      {
        rootElement,
      },
      this.http,
      this.documentService,
      this.tableOfContentService,
      this.coEditionService,
      this.blockDocumentEditorService,
    );

    require(['extension/checkBoxesExtension'], (checkBoxes) => {
      checkBoxes.init(this.checkBoxesConnector);
      this.checkBoxesConnector.jsDepsInited();
    });
  }

  // called from document-actions-dropdown.component.html
  toggleUserGuidance() {
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

  private getLeosState() {
    return combineLatest([
      this.appConfig.config,
      this.documentService.documentConfig$,
    ]).pipe(
      takeUntil(this.destroy$),
      take(1),
      map(([config, extraConfig]) =>
        this.renameConfigKeysForEditor({ ...config, ...extraConfig }),
      ),
    );
  }

  // called from constructor
  private renameConfigKeysForEditor(config: any) {
    const oldConfig: LeosAppConfig & DocumentConfig = cloneDeep(config);
    const tocItems: any = cloneDeep(oldConfig.tocItems);

    tocItems.forEach((i: TocItem) => {
      i.aknTag = i.aknTag.toLowerCase() as any;
      if (this.documentService.documentType.toLowerCase() === 'coverpage') {
        if (i.aknTag.toLowerCase() === 'doc_purpose') {
          i.aknTag = 'docpurpose';
        }
      }
      if (this.documentService.documentType === 'memorandum') {
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

    const profileTCEnabled = !oldConfig.profile || oldConfig.profile.trackChangesEnabled;
    config['isTrackChangesShowed'] = profileTCEnabled && oldConfig.trackChangesShowed;
    config['isTrackChangesEnabled'] = profileTCEnabled && oldConfig.trackChangesEnabled;
    config['permissions'] = oldConfig.userAppPermissions;

    if (!oldConfig.spellCheckerServiceUrl) {
      config.spellCheckerServiceUrl =
        'https://webgate.acceptance.ec.testa.eu/qas/spellcheck';
    }

    if (!oldConfig.spellCheckerSourceUrl) {
      config.spellCheckerSourceUrl =
        'https://webgate.acceptance.ec.testa.eu/qas/static/wscbundle/wscbundle.js';
    }

    return config;
  }
}
