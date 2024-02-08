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
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  take,
  takeUntil,
} from 'rxjs';

import { CKEditorService } from '@/features/akn-document/services/ckeditor.service';
import { ImportService } from '@/features/akn-document/services/import.service';
import { DocumentConfig, DocumentType, Permission } from '@/shared';
import {
  DISPLAY_ENABLE_TRACK_CHANGES_ACTION_ID,
  DISPLAY_SECTION_ID,
  DISPLAY_TOGGLE_TRACK_CHANGES_ACTION_ID,
  DISPLAY_USER_GUIDANCE_ACTION_ID,
  EXPORT_DROPDOWN_EXPORT_VERSION_ID,
  EXPORT_DROPDOWN_EXPORT_VERSION_WITH_ANNOTATIONS_ID,
  EXPORT_SECTION_DROPDOWN_ID,
  EXPORT_SECTION_ID,
  IMPORT_OJ_ACTION_ID,
  IMPORT_OJ_SECTION_ID,
  RELOAD_SECTION_ID,
  RELOAD_SECTION_RELOAD_ACTION_ID,
  SAVE_DOCUMENT_ACTION_ID,
  SAVE_DOCUMENT_SECTION_ID,
  SEARCH_ACTION_ID,
  SEARCH_SECTION_ID,
  STRUCTURE_CHANGE_ANNEX_STRUCTURE_ID,
  STRUCTURE_SECTION_ID,
} from '@/shared/constants/document-actions.constants';
import { DocumentService } from '@/shared/services/document.service';
import { EnvironmentService } from '@/shared/services/enviroment.service';
import { noWhitespaceValidator } from '@/shared/utils/validators';

import { SaveVersionComponent } from '../components/save-version/save-version.component';
import {
  IRibbonToolbarButton,
  IRibbonToolbarItem,
  IRibbonToolbarSection,
  IRibbonToolbarType,
} from '../models/document-actions.model';

const LIST_OF_DISABLE_BUTTONS = [SEARCH_ACTION_ID, RELOAD_SECTION_ID];

@Injectable()
export abstract class DocumentActionsService {
  public actionsItems$: Observable<IRibbonToolbarSection[]>;
  isTrackChangesEnabled = true;
  seeTrackChanges = true;
  dialogAcceptBS = new BehaviorSubject<void>(null);
  isUserGuidanceEnabled = false;

  protected documentConfig: DocumentConfig;
  protected isEditorOpen = false;

  private permissions: Permission[];
  private actionItemsBS = new BehaviorSubject<IRibbonToolbarSection[]>([]);

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
  ) {
    this.actionsItems$ = this.actionItemsBS.asObservable();

    this.documentService.isEditorOpen$.subscribe((isOpen) => {
      this.isEditorOpen = isOpen;
    });

    this.documentService.userGuidanceVisible$.subscribe(
      (value) => (this.isUserGuidanceEnabled = value),
    );

    combineLatest([
      this.documentService.documentConfig$,
      this.documentService.permissions$,
      this.documentService.isEditorOpen$,
    ]).subscribe(([config, permissions]) => {
      this.documentConfig = config;
      this.isTrackChangesEnabled = this.documentConfig.trackChangesEnabled;
      this.seeTrackChanges = this.documentConfig.trackChangesShowed;
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
      this.isCN(),
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
      this.isDocumentTypeTheSame(this.documentService.documentType, 'BILL') &&
      this.buildImportOJSection();
    const exportSection = this.buildExportSection();
    const displaySection = this.buildDisplaySection();
    const editSection = this.editSection();
    const reloadSection = this.buildReloadSection();

    return [
      saveSection,
      importOJSection,
      searchSection,
      exportSection,
      displaySection,
      editSection,
      reloadSection,
    ];
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
    return [versionExport, exportVersionWithAnnotations].filter(Boolean);
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
      cssClasses: ['ribbon-section-checkbox'],
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
          value: this.isUserGuidanceEnabled,
          actionFn: () => this.toggleUserGuidance(),
        },
        {
          type: IRibbonToolbarType.CHECKBOX,
          id: DISPLAY_TOGGLE_TRACK_CHANGES_ACTION_ID,
          label: this.translateService.instant(
            'page.editor.actions-dropdown.enable-track-changes',
          ),
          isSlider: true,
          disabled: !this.permissions.includes('CAN_ACTIVATE_TRACK_CHANGES'),
          value: this.isTrackChangesEnabled,
          actionFn: () => this.toggleTrackChangesEnabled(),
        },
        {
          type: IRibbonToolbarType.CHECKBOX,
          id: DISPLAY_ENABLE_TRACK_CHANGES_ACTION_ID,
          label: this.translateService.instant(
            'page.editor.actions-dropdown.see-track-changes',
          ),
          isSlider: true,
          value: this.seeTrackChanges,
          actionFn: () => this.toggleSeeTrackChanges(),
        },
      ],
    };

    return displaySection;
  }

  private editSection(): IRibbonToolbarSection {
    const section: IRibbonToolbarSection = {
      type: IRibbonToolbarType.SECTION,
      id: STRUCTURE_SECTION_ID,
      label: this.translateService.instant('global.actions.edit'),
      order: 6,
      svgIconClas: 'pencil',
      svgType: 'sharp',
      resizeOrder: 3,
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

  private buildReloadSection(): IRibbonToolbarSection {
    return {
      type: IRibbonToolbarType.SECTION,
      id: RELOAD_SECTION_ID,
      order: 7,
      resizeOrder: 5,
      children: [this.buildReloadButtonItem()],
    };
  }

  private buildReloadButtonItem(): IRibbonToolbarButton {
    return {
      type: IRibbonToolbarType.BUTTON,
      id: RELOAD_SECTION_RELOAD_ACTION_ID,
      svgType: 'outline',
      svgIconClas: 'reload',
      euiStyle: 'secondary',
      euiSize: 's',
      disabled: this.isEditorOpen,
      actionFn: () => this.handleReload(),
    };
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
}
