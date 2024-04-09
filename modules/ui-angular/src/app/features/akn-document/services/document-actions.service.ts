import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EuiDialogConfig, EuiDialogService } from '@eui/components/eui-dialog';
import { EuiDropdownButtonMenuItem } from '@eui/components/eui-dropdown-button-menu';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, map, Observable, take } from 'rxjs';

import { AppConfigService } from '@/core/services/app-config.service';
import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { ImportService } from '@/features/akn-document/services/import.service';
import { MergeContributionsService } from '@/features/akn-document/services/merge-contributions.service';
import {
  PageMode,
  PageModeService,
} from '@/features/akn-document/services/page-mode.service';
import { SyncDocumentScrollService } from '@/features/akn-document/services/sync-document-scroll.service';
import { VersionCompareService } from '@/features/akn-document/services/version-compare.service';
import {
  DocumentConfig,
  DocumentType,
  LeosConfig,
  Permission,
  Profile,
} from '@/shared';
import {
  COMPARE_EXPORT_DROPDOWN_EXPORT_PDF,
  COMPARE_EXPORT_DROPDOWN_EXPORT_XML,
  COMPARE_EXPORT_DROPDOWN_ID,
  COMPARE_GROUP_BUTTONS_ID,
  COMPARE_NEXT_CHANGE_ACTION_ID,
  COMPARE_PREV_CHANGE_ACTION_ID,
  COMPARE_SECTION_ID,
  COMPARE_SYNC_PANELS_ACTION,
  DISPLAY_ENABLE_TRACK_CHANGES_ACTION_ID,
  DISPLAY_SECTION_ID,
  DISPLAY_SHOW_CLEAN_VERSION,
  DISPLAY_TOGGLE_TRACK_CHANGES_ACTION_ID,
  DISPLAY_USER_GUIDANCE_ACTION_ID,
  EXPORT_DROPDOWN_EXPORT_CLEAN_VERSION_ID,
  EXPORT_DROPDOWN_EXPORT_VERSION_ID,
  EXPORT_DROPDOWN_EXPORT_VERSION_WITH_ANNOTATIONS_ID,
  EXPORT_SECTION_DROPDOWN_ID,
  EXPORT_SECTION_ID,
  FINALIZE_ACTION_ID,
  FINALIZE_SECTION_ID,
  IMPORT_OJ_ACTION_ID,
  IMPORT_OJ_SECTION_ID,
  MERGE_CONTRIBUTION_APPLY_CHANGES_ID,
  MERGE_CONTRIBUTION_APPLY_CHANGES_TC_ID,
  MERGE_CONTRIBUTION_GROUP_PREV_NEXT_ID,
  MERGE_CONTRIBUTION_MARK_AS_PROCESSED_ID,
  MERGE_CONTRIBUTION_NEXT_CHANGE_ID,
  MERGE_CONTRIBUTION_PREV_CHANGE_ID,
  MERGE_SECTION_ID,
  RELOAD_SECTION_ID,
  SAVE_DOCUMENT_ACTION_ID,
  SAVE_DOCUMENT_SECTION_ID,
  SEARCH_ACTION_ID,
  SEARCH_SECTION_ID,
  STRUCTURE_CHANGE_ANNEX_STRUCTURE_ID,
  STRUCTURE_SECTION_ID,
  VIEW_SYNC_PANELS_ACTION,
  VIEW_VERSION_SECTION_ID,
} from '@/shared/constants/document-actions.constants';
import { DocumentService } from '@/shared/services/document.service';
import { EnvironmentService } from '@/shared/services/enviroment.service';
import { LeosLightService } from '@/shared/services/leos-light.service';
import { noWhitespaceValidator } from '@/shared/utils/validators';

import { SaveVersionComponent } from '../components/save-version/save-version.component';
import {
  IRibbonToolbarButton,
  IRibbonToolbarItem,
  IRibbonToolbarSection,
  IRibbonToolbarType,
} from '../models/document-actions.model';
import { ViewVersionService } from './view-version.service';

const LIST_OF_DISABLE_BUTTONS = [SEARCH_ACTION_ID, RELOAD_SECTION_ID];

@Injectable()
export abstract class DocumentActionsService {
  applyDisabled$: Observable<boolean>;

  public actionsItems$: Observable<IRibbonToolbarSection[]>;
  protected pageMode: PageMode;
  protected leosConfig: LeosConfig;
  protected documentConfig: DocumentConfig;
  protected isEditorOpen = false;

  private profile: Profile;
  private permissions: Permission[];
  private isTrackChangesEnabled = true;
  private seeTrackChanges = true;
  private mergeWithTrackChanges = false;

  private actionItemsBS = new BehaviorSubject<IRibbonToolbarSection[]>([]);
  private applyDisabledBS = new BehaviorSubject<boolean>(true);

  protected constructor(
    protected router: Router,
    protected documentService: DocumentService,
    protected translateService: TranslateService,
    protected domSanitizer: DomSanitizer,
    protected ckEditorService: CKEditorService,
    protected dialogService: EuiDialogService,
    protected environmentService: EnvironmentService,
    protected formBuilder: FormBuilder,
    protected importService: ImportService,
    protected versionCompareService: VersionCompareService,
    protected viewVersionService: ViewVersionService,
    protected syncScrollService: SyncDocumentScrollService,
    protected mergeContributionService: MergeContributionsService,
    protected pageModeService: PageModeService,
    protected appConfigService: AppConfigService,
    protected leosLightService: LeosLightService,
  ) {
    this.actionsItems$ = this.actionItemsBS.asObservable();
    this.applyDisabled$ = this.applyDisabledBS.asObservable();

    this.documentService.isEditorOpen$.subscribe((isOpen) => {
      this.isEditorOpen = isOpen;
    });

    this.mergeContributionService.contributionSelected$.subscribe((value) => {
      if (value || !this.canAcceptTrackChanges()) {
        this.applyDisabledBS.next(true);
      } else {
        this.applyDisabledBS.next(false);
      }
    });

    combineLatest([
      this.appConfigService.config,
      this.documentService.documentConfig$,
      this.documentService.permissions$,
      this.documentService.isEditorOpen$,
      this.pageModeService.pageMode$,
    ]).subscribe(([appConfig, config, permissions, _, pageMode]) => {
      this.profile = appConfig.profile;
      this.documentConfig = config;
      this.pageMode = pageMode;
      this.isTrackChangesEnabled =
        (!this.profile || this.profile.trackChangesEnabled) &&
        this.documentConfig.trackChangesEnabled;
      this.seeTrackChanges =
        (!this.profile || this.profile.trackChangesEnabled) &&
        this.documentConfig.trackChangesShowed;
      this.updateTrackChangesStatus();
      this.permissions = permissions;
      const newActions = this.buildActions();
      this.actionItemsBS.next(newActions);
    });
  }

  get documentActionItems() {
    return this.actionItemsBS.value;
  }

  public resetDocumentActions() {
    this.actionItemsBS.next([]);
  }

  abstract getInstanceSpecificItem(
    commonItems: IRibbonToolbarItem[],
  ): IRibbonToolbarSection[];

  protected isDocumentTypeTheSame(
    documentType: string,
    targetType: DocumentType,
  ) {
    return documentType.toLowerCase() === targetType.toLowerCase();
  }

  protected hasPermission(targetPermission: Permission) {
    return this.permissions.includes(targetPermission);
  }

  protected findItemById(
    id: string,
    items: IRibbonToolbarItem[],
  ): IRibbonToolbarItem | undefined {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }

      if (item.type === IRibbonToolbarType.SECTION) {
        const section = item as IRibbonToolbarSection;
        const childItem = this.findItemById(id, section.children);
        if (childItem) {
          return childItem;
        }
      }
    }
  }

  protected isMandateMemorandum(): boolean {
    return (
      this.isCN() &&
      this.isDocumentTypeTheSame(
        this.documentService.documentType,
        'MEMORANDUM',
      )
    );
  }

  protected isMandateExplanatory(): boolean {
    return (
      this.isCN() &&
      this.isDocumentTypeTheSame(
        this.documentService.documentType,
        'COUNCIL_EXPLANATORY',
      )
    );
  }

  protected isClonedProposal() {
    return this.documentConfig.clonedProposal;
  }

  private onEditorDisableButtons(buttonsToDisable: string[]) {
    buttonsToDisable.forEach((id) => {
      const action = this.findItemById(id, this.documentActionItems);
      if (action) {
        action.disabled = this.isEditorOpen;
      }
    });

    this.actionItemsBS.next(this.documentActionItems);
  }

  private buildActions(): IRibbonToolbarSection[] {
    const commonItems = this.buildCommonItems();
    const instanceSpecificItems = this.getInstanceSpecificItem(commonItems);
    const items = [...commonItems, ...instanceSpecificItems].filter(
      (section) => section && section.children?.length > 0,
    );
    this.onEditorDisableButtons(LIST_OF_DISABLE_BUTTONS);
    return items.sort((a, b) => a.order - b.order);
  }

  private buildCommonItems(): IRibbonToolbarSection[] {
    const saveSection = !this.isMandateMemorandum() && this.buildSaveSection();
    const searchSection = this.buildSearchSection();
    const importOJSection =
      (!this.profile || this.profile.importOJ) &&
      this.isDocumentTypeTheSame(this.documentService.documentType, 'BILL') &&
      this.buildImportOJSection();
    const exportSection = this.buildExportSection();
    const displaySection = this.buildDisplaySection();
    // TODO : if this is only present for drafting instance should be moved to document-actions-proposal.service.ts
    const trackChangesSection = !this.isCN() && this.buildTrackChangesSection();
    const editSection = this.editSection();
    const compareSection =
      this.pageMode === PageMode.CompareVersions && this.buildCompareSection();
    const viewVersionSection =
      this.pageMode === PageMode.ViewVersion && this.buildViewVersionSection();
    const mergeContributionsSection =
      this.pageMode === PageMode.Contribution &&
      this.buildMergeContributionsSection();
    const finalizeSection =
      this.showMarkAsDoneButton && this.buildFinalizeSection();
    return [
      saveSection,
      importOJSection,
      searchSection,
      exportSection,
      displaySection,
      trackChangesSection,
      editSection,
      compareSection,
      viewVersionSection,
      mergeContributionsSection,
      finalizeSection,
    ].filter(Boolean);
  }

  private buildSaveSection(): IRibbonToolbarSection {
    return {
      type: IRibbonToolbarType.SECTION,
      id: SAVE_DOCUMENT_SECTION_ID,
      order: 1,
      resizeOrder: 2,
      children: [
        {
          id: SAVE_DOCUMENT_ACTION_ID,
          actionFn: () => this.openSaveDocumentVersionDialog(),
          euiStyle: 'secondary',
          euiSize: 's',
          label: 'Save',
          svgIconClas: 'save',
          svgType: 'default',
          type: IRibbonToolbarType.BUTTON,
        },
      ],
    };
  }

  private buildImportOJSection(): IRibbonToolbarSection {
    return {
      type: IRibbonToolbarType.SECTION,
      id: IMPORT_OJ_SECTION_ID,
      order: 2,
      resizeOrder: 1,
      children: [
        {
          type: IRibbonToolbarType.BUTTON,
          id: IMPORT_OJ_ACTION_ID,
          label: this.translateService.instant(
            'page.editor.actions-dropdown.import-short',
          ),
          description: this.translateService.instant(
            'page.editor.actions-dropdown.import',
          ),
          euiSize: 's',
          euiStyle: 'secondary',
          iconClass: 'eui-icon-book-o',
          actionFn: () => this.importService.openImportOJDialog(),
        },
      ],
    };
  }

  private buildExportSection(): IRibbonToolbarSection | null {
    const exportOptions = this.buildExportDropdownOptions();
    if (exportOptions && exportOptions.length === 0) return null;
    return {
      type: IRibbonToolbarType.SECTION,
      id: EXPORT_SECTION_ID,
      order: 3,
      resizeOrder: 4,
      children: [
        {
          type: IRibbonToolbarType.DROPDOWN,
          id: EXPORT_SECTION_DROPDOWN_ID,
          label: this.translateService.instant(
            'page.editor.actions-dropdown.export.options',
          ),
          euiSize: 's',
          euiStyle: 'secondary',
          iconClass: 'eui-icon-more-vertical',
          items: [...exportOptions],
        },
      ],
    };
  }

  private buildExportDropdownOptions(): EuiDropdownButtonMenuItem[] {
    const versionExport =
      !this.isMandateMemorandum() &&
      !this.isMandateExplanatory() &&
      this.buildExportVersionItem();
    const exportVersionWithAnnotations =
      !this.isMandateMemorandum() &&
      this.buildExportVersionWithAnnotationsItem();
    const exportCleanVersion =
      ((!this.isMandateMemorandum() && this.isCN()) ||
        this.isClonedProposal()) &&
      this.buildExportCleanVersionButtonItem();

    return [
      versionExport,
      exportVersionWithAnnotations,
      exportCleanVersion,
    ].filter(Boolean);
  }

  private buildExportVersionItem(): EuiDropdownButtonMenuItem {
    return {
      id: EXPORT_DROPDOWN_EXPORT_VERSION_ID,
      label: this.translateService.instant(
        'page.editor.actions-dropdown.export',
      ),
      iconClass: 'eui-icon-ecl-download',
      command: () => this.documentService.download(),
    };
  }

  private buildExportCleanVersionButtonItem(): EuiDropdownButtonMenuItem {
    return {
      id: EXPORT_DROPDOWN_EXPORT_CLEAN_VERSION_ID,
      label: this.translateService.instant(
        'page.editor.actions-dropdown.export-clean-version',
      ),
      command: () => {
        this.documentService.downloadCleanVersion();
      },
    };
  }

  private buildExportVersionWithAnnotationsItem(): EuiDropdownButtonMenuItem {
    return {
      id: EXPORT_DROPDOWN_EXPORT_VERSION_WITH_ANNOTATIONS_ID,
      label: this.translateService.instant(
        'page.editor.actions-dropdown.export-with-annotations',
      ),
      iconClass: 'eui-icon-ecl-download',
      command: () => this.documentService.download(true),
    };
  }

  private buildSearchSection(): IRibbonToolbarSection {
    return {
      type: IRibbonToolbarType.SECTION,
      id: SEARCH_SECTION_ID,
      order: 4,
      resizeOrder: 3,
      children: [
        {
          type: IRibbonToolbarType.BUTTON,
          id: SEARCH_ACTION_ID,
          label: this.translateService.instant(
            'page.editor.search.search-input.label',
          ),
          euiStyle: 'secondary',
          euiSize: 's',
          iconClass: 'eui-icon-search-m',
          disabled: this.isEditorOpen,
          // todo move search on it's own service ... requirs refactoring fro @kostas_kontos
          actionFn: () => this.documentService.toggleSearchPane(),
        },
      ],
    };
  }

  private buildDisplaySection(): IRibbonToolbarSection {
    const displaySection: IRibbonToolbarSection = {
      type: IRibbonToolbarType.SECTION,
      id: DISPLAY_SECTION_ID,
      label: this.translateService.instant(
        'page.editor.actions-dropdown.display',
      ),
      order: 5,
      resizeOrder: 2,
      svgIconClas: 'eye',
      svgType: 'default',
      children: [
        {
          type: IRibbonToolbarType.CHECKBOX,
          id: DISPLAY_USER_GUIDANCE_ACTION_ID,
          label: this.translateService.instant(
            'page.editor.actions-dropdown.see-user-guidance',
          ),
          isSlider: true,
          value: this.documentService.userGuidanceVisible$,
          actionFn: () => this.toggleUserGuidance(),
        },
      ],
    };

    if (this.showCleanVersion()) {
      displaySection.children.push(this.buildShowCleanVersionItem());
    }
    return displaySection;
  }

  private buildShowCleanVersionItem(): IRibbonToolbarButton {
    return {
      type: IRibbonToolbarType.BUTTON,
      id: DISPLAY_SHOW_CLEAN_VERSION,
      label: this.translateService.instant(
        'page.editor.actions-dropdown.show-clean-version',
      ),
      disabled: this.viewVersionService.cleanVersionView$.pipe(
        map((view) => view !== null),
      ),
      euiStyle: 'secondary',
      euiSize: 's',
      actionFn: () => {
        this.viewVersionService.toggleViewCleanVersion();
      },
    };
  }

  private buildTrackChangesSection(): IRibbonToolbarSection {
    return {
      type: IRibbonToolbarType.SECTION,
      id: 'SEE-TRACK_CHANGES-ID',
      label: this.translateService.instant(
        'page.editor.toolbar-actions.section.track-changes.label',
      ),
      children: [...this.buildTrackChangesSectionItems()],
      order: 5,
      resizeOrder: 3,
    };
  }

  private buildTrackChangesSectionItems(): IRibbonToolbarItem[] {
    if (!this.profile || this.profile.trackChangesEnabled) {
      return [
        {
          type: IRibbonToolbarType.CHECKBOX,
          id: DISPLAY_TOGGLE_TRACK_CHANGES_ACTION_ID,
          label: this.translateService.instant(
            'page.editor.actions-dropdown.enable-track-changes',
          ),
          isSlider: true,
          disabled:
            !this.permissions.includes('CAN_ACTIVATE_TRACK_CHANGES') ||
            this.isEditorOpen ||
            this.isClonedProposal(),
          value: this.isTrackChangesEnabled,
          actionFn: () => this.toggleTrackChangesEnabled(),
        },
        {
          type: IRibbonToolbarType.CHECKBOX,
          id: DISPLAY_ENABLE_TRACK_CHANGES_ACTION_ID,
          label: this.translateService.instant(
            'page.editor.actions-dropdown.see-track-changes',
          ),
          disabled: this.documentService.isEditorOpen$,
          isSlider: true,
          value: this.seeTrackChanges,
          actionFn: () => this.toggleSeeTrackChanges(),
        },
      ];
    } else {
      return [];
    }
  }

  private editSection(): IRibbonToolbarSection {
    const section: IRibbonToolbarSection = {
      type: IRibbonToolbarType.SECTION,
      id: STRUCTURE_SECTION_ID,
      label: this.translateService.instant('global.actions.edit'),
      order: 6,
      resizeOrder: 3,
      svgIconClas: 'pencil',
      svgType: 'sharp',
      children: [],
    };

    if (
      this.isDocumentTypeTheSame(this.documentService.documentType, 'ANNEX')
    ) {
      section.children.push(this.buildChangeAnnexStructure());
    }

    return section;
  }

  private buildChangeAnnexStructure(): IRibbonToolbarButton {
    return {
      type: IRibbonToolbarType.BUTTON,
      id: STRUCTURE_CHANGE_ANNEX_STRUCTURE_ID,
      label: this.translateService.instant(
        'page.editor.actions-dropdown.change-document-structure',
      ),
      description: this.translateService.instant(
        'page.editor.actions-dropdown.change-document-structure',
      ),
      euiStyle: 'secondary',
      euiSize: 's',
      svgIconClas: 'construct',
      svgType: 'outline',
      actionFn: () => this.confirmAnnexStructureChange(),
    };
  }

  private buildCompareSection(): IRibbonToolbarSection {
    return {
      type: IRibbonToolbarType.SECTION,
      id: COMPARE_SECTION_ID,
      cssClasses: 'eui-u-flex eui-u-flex-row app-u-gap-xs',
      sectionContainerCssClasses: 'overlay-versions-compare',
      children: this.buildCompareSectionItems(),
      label: this.versionCompareService.versionsComparisonForViewHeaderTitle$,
      svgType: 'sharp',
      svgIconClas: 'documents',
      closable: true,
      closableBtnStyle: 'primary',
      closeFn: () => this.versionCompareService.closeVersionComparisonView(),
      order: 7,
      resizeOrder: 6,
    };
  }

  private buildViewVersionSection(): IRibbonToolbarSection {
    return {
      type: IRibbonToolbarType.SECTION,
      id: VIEW_VERSION_SECTION_ID,
      cssClasses: 'eui-u-flex eui-u-flex-row app-u-gap-xs',
      sectionContainerCssClasses: 'overlay-view-version',
      label: this.viewVersionService.versionViewLabel$,
      children: [...this.buildViewVersionSectionItems()],
      svgType: 'sharp',
      svgIconClas: 'documents',
      resizeOrder: 2,
      order: 6,
      closable: true,
      closableBtnStyle: 'primary',
      closeFn: () => this.viewVersionService.closeVersionView(),
    };
  }

  private buildCompareSectionItems(): IRibbonToolbarItem[] {
    return [
      {
        type: IRibbonToolbarType.GROUP,
        id: COMPARE_GROUP_BUTTONS_ID,
        cssClasses: 'eui-u-flex eui-u-flex-row compare-button-group',
        children: [
          {
            type: IRibbonToolbarType.BUTTON,
            id: COMPARE_PREV_CHANGE_ACTION_ID,
            iconClass: 'eui-icon-sort-asc',
            euiSize: 's',
            euiStyle: 'primary',
            basicButton: true,
            actionFn: () => this.versionCompareService.handlePrevChange(),
            disabled: this.versionCompareService.hasPrevChangesDisabled$,
            description: this.translateService.instant(
              'page.editor.versions.compare.actions.prev-change',
            ),
          },
          {
            type: IRibbonToolbarType.BUTTON,
            id: COMPARE_NEXT_CHANGE_ACTION_ID,
            iconClass: 'eui-icon-sort-desc',
            euiSize: 's',
            euiStyle: 'primary',
            basicButton: true,
            actionFn: () => this.versionCompareService.handleNextChange(),
            disabled: this.versionCompareService.hasNextChangeDisabled$,
            description: this.translateService.instant(
              'page.editor.versions.compare.actions.next-change',
            ),
          },
        ],
      },
      {
        type: IRibbonToolbarType.CHECKBOX,
        id: COMPARE_SYNC_PANELS_ACTION,
        label: 'Sync panels',
        isSlider: true,
        value: this.syncScrollService.isSyncScrollEnabled$,
        actionFn: () => this.versionCompareService.toggleSyncScroll(),
        cssClasses:
          'eui-u-flex eui-u-flex-column eui-u-flex-justify-content-center',
      },
      {
        type: IRibbonToolbarType.DROPDOWN,
        id: COMPARE_EXPORT_DROPDOWN_ID,
        euiSize: 's',
        euiStyle: 'secondary',
        label: 'Export',
        iconClass: 'eui-icon-more-vertical',
        disabled: this.versionCompareService.versionCompareIds$.pipe(
          map((versions) => versions.length <= 1),
        ),
        items: this.buildCompareSectionExportOptions(),
      },
    ];
  }

  private buildCompareSectionExportOptions(): EuiDropdownButtonMenuItem[] {
    return [
      {
        id: COMPARE_EXPORT_DROPDOWN_EXPORT_PDF,
        label: this.translateService.instant(
          'page.editor.versions.compare.actions.download-pdf',
        ),
        command: () => this.versionCompareService.downloadPdfFile(),
      },
      {
        id: COMPARE_EXPORT_DROPDOWN_EXPORT_XML,
        label: this.translateService.instant(
          'page.editor.versions.compare.actions.download-xml-files',
        ),
        command: () => this.versionCompareService.downloadXmlFile(),
      },
    ];
  }

  private buildViewVersionSectionItems(): IRibbonToolbarItem[] {
    return [
      {
        type: IRibbonToolbarType.CHECKBOX,
        id: VIEW_SYNC_PANELS_ACTION,
        label: 'Sync panels',
        isSlider: true,
        value: this.syncScrollService.isSyncScrollEnabled$,
        actionFn: () => this.viewVersionService.toggleSyncScroll(),
        cssClasses:
          'eui-u-flex eui-u-flex-column eui-u-flex-justify-content-center',
      },
    ];
  }

  private buildMergeContributionsSection(): IRibbonToolbarSection {
    return {
      type: IRibbonToolbarType.SECTION,
      id: MERGE_SECTION_ID,
      label: this.translateService.instant(
        'page.editor.contribution.actions.view.and.merge',
      ),
      sectionContainerCssClasses: 'overlay-merge-contribution',
      cssClasses: 'eui-u-flex eui-u-flex-row app-u-gap-xs',
      children: [...this.buildMergeContributionsSectionItems()],
      svgIconClas: 'git-merge',
      svgType: 'sharp',
      closable: true,
      closableBtnStyle: 'secondary',
      closeFn: () => this.mergeContributionService.closeContributionMergeView(),
      order: 7,
      resizeOrder: 6,
    };
  }

  private buildMergeContributionsSectionItems(): IRibbonToolbarItem[] {
    return [
      {
        type: IRibbonToolbarType.GROUP,
        id: MERGE_CONTRIBUTION_GROUP_PREV_NEXT_ID,
        cssClasses: 'eui-u-flex eui-u-flex-row app-u-gap-xs merge-button-group',
        children: [
          {
            type: IRibbonToolbarType.BUTTON,
            id: MERGE_CONTRIBUTION_PREV_CHANGE_ID,
            iconClass: 'eui-icon-sort-asc',
            euiSize: 's',
            euiStyle: 'secondary',
            basicButton: true,
            actionFn: () =>
              this.mergeContributionService.handlePrevChangeContribution(),
            disabled: this.mergeContributionService.hasPrevChangesDisabled$,
            description: this.translateService.instant(
              'page.editor.versions.compare.actions.prev-change',
            ),
          },
          {
            type: IRibbonToolbarType.BUTTON,
            id: MERGE_CONTRIBUTION_NEXT_CHANGE_ID,
            iconClass: 'eui-icon-sort-desc',
            euiSize: 's',
            euiStyle: 'secondary',
            basicButton: true,
            actionFn: () =>
              this.mergeContributionService.handleNextChangeContribution(),
            disabled: this.mergeContributionService.hasNextChangeDisabled$,
            description: this.translateService.instant(
              'page.editor.versions.compare.actions.next-change',
            ),
          },
        ],
      },
      {
        type: IRibbonToolbarType.CHECKBOX,
        id: COMPARE_SYNC_PANELS_ACTION,
        label: this.translateService.instant(
          'page.editor.contribution.view.actions.synchronous-scrolling',
        ),
        isSlider: true,
        value: this.syncScrollService.isSyncScrollEnabled$,
        actionFn: () => this.mergeContributionService.toggleSyncScroll(),
        cssClasses:
          'eui-u-flex eui-u-flex-column eui-u-flex-justify-content-center',
      },
      {
        type: IRibbonToolbarType.DROPDOWN,
        id: COMPARE_EXPORT_DROPDOWN_ID,
        euiSize: 's',
        euiStyle: 'secondary',
        description: this.translateService.instant(
          'page.editor.contribution.actions-button.tooltip',
        ),
        iconClass: 'eui-icon-more-vertical',
        items: this.buildMergeContributionApplyDropdownOptions(),
        cssClasses: 'eui-button--basic eui-button--icon-only',
      },
      {
        type: IRibbonToolbarType.BUTTON,
        id: 'apply-id',
        euiSize: 's',
        euiStyle: 'secondary',
        label: this.translateService.instant(
          'page.editor.contribution.view.actions.apply',
        ),
        disabled: this.applyDisabled$,
        actionFn: () => this.handleMerge(),
      },
      {
        type: IRibbonToolbarType.BUTTON,
        id: 'send-feedback-id',
        euiSize: 's',
        euiStyle: 'secondary',
        disabled: this.mergeContributionService.disableSendFeedbackToBeSent$,
        label: this.translateService.instant(
          'page.editor.contribution.actions.view.and.merge.actions.send.feedback',
        ),
        actionFn: () => this.mergeContributionService.onClickSendFeedback(),
      },
    ];
  }

  private buildMergeContributionApplyDropdownOptions(): EuiDropdownButtonMenuItem[] {
    return [
      {
        id: MERGE_CONTRIBUTION_APPLY_CHANGES_ID,
        command: () => this.onClickApplyAllChanges(),
        label: this.translateService.instant(
          'page.editor.contribution.actions.view.and.merge.actions.apply.changes',
        ),
        disabled: !this.canAcceptTrackChanges(),
      },
      {
        id: MERGE_CONTRIBUTION_APPLY_CHANGES_TC_ID,
        command: () => this.onClickApplyAllChangesWithTC(),
        label: this.translateService.instant(
          'page.editor.contribution.actions.view.and.merge.actions.apply.changes.tc',
        ),
        disabled: !this.canAcceptTrackChanges(),
      },
      {
        id: MERGE_CONTRIBUTION_MARK_AS_PROCESSED_ID,
        command: () => this.mergeContributionService.onClickMarkAsProcessed(),
        label: this.translateService.instant(
          'page.editor.contribution.actions.view.and.merge.actions.mark',
        ),
        disabled: !this.canRejectTrackChanges(),
      },
    ];
  }

  private onClickApplyAllChanges() {
    this.mergeWithTrackChanges = false;
    this.openMergeAllContributionsChangesDialog();
  }

  private onClickApplyAllChangesWithTC() {
    this.mergeWithTrackChanges = true;
    this.openMergeAllContributionsChangesDialog();
  }

  private openMergeAllContributionsChangesDialog() {
    const content = this.translateService.instant(
      `page.editor.contribution.view.merge-contributions.accept-all.modal-text`,
    );
    const conteSanitized = this.domSanitizer.bypassSecurityTrustHtml(content);

    this.dialogService.openDialog({
      title: this.translateService.instant(
        'page.editor.contribution.view.merge-contributions.accept-all.modal-title',
      ),
      content: conteSanitized as TemplatePortal,
      acceptLabel: this.translateService.instant('global.actions.continue'),
      dismissLabel: this.translateService.instant('global.actions.cancel'),
      accept: () => {
        this.onAcceptMergeAllContributions();
      },
    });
  }

  private onAcceptMergeAllContributions() {
    this.ckEditorService.handleMergeContributionsActions(
      this.mergeWithTrackChanges,
      true,
    );
  }

  private onCancelMergeAllContributions() {}

  private handleMerge() {
    this.ckEditorService.handleMergeContributionsActions(
      this.mergeWithTrackChanges,
      false,
    );
    this.mergeContributionService.handleContributionSelectCount(false, true);
  }

  private buildFinalizeSection(): IRibbonToolbarSection {
    return {
      type: IRibbonToolbarType.SECTION,
      id: FINALIZE_SECTION_ID,
      order: 8,
      resizeOrder: 1,
      sectionContainerCssClasses: 'overlay-finalize',
      cssClasses: 'eui-u-flex eui-u-flex-row app-u-gap-xs',
      children: [
        {
          type: IRibbonToolbarType.BUTTON,
          id: FINALIZE_ACTION_ID,
          label: this.translateService.instant('global.actions.mark.done'),
          description: this.translateService.instant(
            'global.actions.mark.done',
          ),
          euiSize: 's',
          euiStyle: 'secondary',
          actionFn: () =>
            this.leosLightService.exportDocument(
              this.documentService.documentType,
              this.documentService.documentRef,
            ),
        },
      ],
    };
  }

  get showMarkAsDoneButton() {
    const documentMetada =
      this.documentConfig &&
      this.documentConfig.documentsMetadata &&
      this.documentConfig.documentsMetadata.find(
        (d) => (d.category = this.documentService.documentType),
      );
    return (
      this.profile?.markAsDoneAvailable &&
      documentMetada?.callbackAddress != null
    );
  }

  private toggleUserGuidance() {
    this.ckEditorService.toggleUserGuidance();
  }

  private toggleSeeTrackChanges() {
    this.seeTrackChanges = !this.seeTrackChanges;
    this.ckEditorService.changeSeeTrackChangesState();
    this.updateTrackChangesStatus();
  }

  private toggleTrackChangesEnabled() {
    this.isTrackChangesEnabled = !this.isTrackChangesEnabled;
    this.ckEditorService.changeEnableTrackChangesState(
      this.isTrackChangesEnabled,
    );
    this.documentService.toggleTrackChangesEnabled(this.isTrackChangesEnabled);
    this.updateTrackChangesStatus();
  }

  private updateTrackChangesStatus() {
    this.seeTrackChanges = this.documentConfig.trackChangesShowed;
    this.documentService.updateTrackChangesStatus({
      isTrackChangesEnabled: this.isTrackChangesEnabled,
      isTrackChangesShowed: this.seeTrackChanges,
    });
  }

  private openSaveDocumentVersionDialog() {
    const saveForm = this.createSaveForm();
    this.dialogService.openDialog(
      new EuiDialogConfig({
        dialogId: 'save-document-version-id',
        title: this.translateService.instant(
          'page.editor.actions-dropdown.save-version.modal',
        ),
        bodyComponent: {
          component: SaveVersionComponent,
          config: {
            saveForm,
          },
        },
        accept: () => this.saveVersionAction(saveForm),
      }),
    );
  }

  private createSaveForm() {
    return this.formBuilder.group({
      title: new FormControl('', {
        validators: [Validators.required, noWhitespaceValidator],
      }),
      description: new FormControl(''),
    });
  }

  private getNewVersionData(form: FormGroup) {
    // TODO when version Type is defined refactor this.
    const { title, description } = form.getRawValue();
    return {
      checkinComment: JSON.stringify({
        title,
        description,
      }),
      versionType: 'INTERMEDIATE',
    };
  }

  private saveVersionAction(form: FormGroup) {
    this.documentService
      .saveVersion(this.getNewVersionData(form))
      .subscribe(() => this.documentService.reloadDocument());
  }

  private confirmAnnexStructureChange() {
    const nextAnnexStructure = this.getNextAnnexStructure();
    const content = this.translateService.instant(
      `editor-switch-annex-structure-to-${nextAnnexStructure}-content`,
    );
    const conteSanitized = this.domSanitizer.bypassSecurityTrustHtml(content);

    this.dialogService.openDialog({
      title: this.translateService.instant(
        'editor.annex-structure-change-title',
      ),
      content: conteSanitized as TemplatePortal,
      acceptLabel: this.translateService.instant('global.actions.confirm'),
      accept: () => {
        this.handleAnnexChangeStructure();
      },
    });
  }

  private handleAnnexChangeStructure() {
    this.documentService
      .switchDocumentStructure()
      .pipe(take(1))
      .subscribe(() => {
        this.reloadComponent();
      });
  }

  private getNextAnnexStructure() {
    return this.documentConfig.documentsMetadata.find(
      (d) => d.ref === this.documentService.documentRef,
    ).template === 'SG-018'
      ? 'level'
      : 'article';
  }

  private reloadComponent() {
    this.documentService.reloadDocument();
    this.documentService.reloadView();
  }

  private handleReload() {
    this.documentService.reloadDocument();
  }

  private isCN() {
    return this.environmentService.isCouncil();
  }

  private showCleanVersion() {
    return (
      (!this.isMandateMemorandum() &&
        !this.isMandateExplanatory() &&
        this.isCN()) ||
      this.isClonedProposal()
    );
  }

  private canAcceptTrackChanges() {
    return (
      this.permissions?.includes('CAN_ACCEPT_CHANGES') &&
      (!this.documentConfig?.clonedProposal ||
        (this.documentConfig?.clonedProposal &&
          this.leosConfig?.user.roles.includes('SUPPORT')))
    );
  }

  private canRejectTrackChanges() {
    return this.permissions?.includes('CAN_REJECT_CHANGES');
  }
}
