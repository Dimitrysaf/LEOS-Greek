import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ApplicationRole, CatalogItem} from "@/shared";
import {EuiBadgeModule} from "@eui/components/eui-badge";
import {EuiButtonModule} from "@eui/components/eui-button";
import {EuiIconModule} from "@eui/components/eui-icon";
import {EuiInputTextModule} from "@eui/components/eui-input-text";
import {EuiLabelModule} from "@eui/components/eui-label";
import {EuiSelectModule} from "@eui/components/eui-select";
import {EuiTreeComponent, EuiTreeModule, TreeDataModel, TreeItemModel, TreeNode} from "@eui/components/eui-tree";
import {FormsModule} from "@angular/forms";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {EuiTreeSelectionChanges} from "@eui/components/eui-tree/eui-tree.model";
import {appConfig} from "../../../../config";
import {ProposalService} from "@/shared/services/proposal.service";
import {Subject, takeUntil} from "rxjs";
import {EuiAllModule} from "@eui/components";
import {
  ProposalMilestonePublishToCatalogDialogComponent
} from "@/features/proposal-view/containers/proposal-milestone-publish-to-dg-template-catalog/proposal-milestone-publish-to-catalog-dialog.component";
import {ProposalViewModule} from "@/features/proposal-view/proposal-view.module";
import {switchMap} from "rxjs/operators";
import {MilestoneDescriptor} from "@/shared/components/proposal-milestone-view/proposal-milestone-view.component";
import {Router} from "@angular/router";

const defaultLanguage =
  appConfig.global.i18n.i18nService.defaultLanguage.toUpperCase();
const iconClassCategory = 'folder:sharp';
const iconClassTemplate = 'document:sharp';

@Component({
  selector: 'app-proposal-view-custom-template',
  standalone: true,
  imports: [
    EuiBadgeModule,
    EuiButtonModule,
    EuiIconModule,
    EuiInputTextModule,
    EuiLabelModule,
    EuiSelectModule,
    EuiTreeModule,
    FormsModule,
    NgForOf,
    NgIf,
    TranslateModule,
    JsonPipe,
    EuiAllModule,
    ProposalViewModule
  ],
  templateUrl: './proposal-view-custom-template.component.html',
  styleUrl: './proposal-view-custom-template.component.scss'
})
export class ProposalViewCustomTemplateComponent {

  @Input() translationKey: 'document' | 'draft' = 'document';
  @Input() isCopyChangeAct!: boolean;
  @Input() isCustomTemplatesCatalog!: boolean;
  @Input() documentCollectionName!: string;
  @Input() proposalTemplate!: string;
  @Input() userRoles!: ApplicationRole[];
  @ViewChild('treeComponent') treeComponent: EuiTreeComponent;
  @ViewChild('updateNameAndDgTemplateCatalog')
  updateNameAndDgTemplateCatalog: ProposalMilestonePublishToCatalogDialogComponent;
  @Output() selectTemplate = new EventEmitter<CatalogItem | null>();
  @Output() selectLanguage = new EventEmitter<string>();
  milestoneViewData: MilestoneDescriptor = {
    clone: undefined,
    createdBy: undefined,
    createdDate: undefined,
    legDocumentName: undefined,
    proposalRef: undefined,
    title: undefined,
    legFileId: undefined,
    versionedReference: undefined
  };
  treeNodes: TreeDataModel = null;
  filteredNodes: TreeDataModel = null;
  filterText: string;
  disabled: boolean = false;
  selectedLanguage: string;
  languages: Array<{ code: string; label: string }>;

  isExpanded: boolean;
  private templates: Map<string, CatalogItem> = new Map();

  private documentRef: String;

  private destroy$ = new Subject<void>();
  constructor(
    private proposalService: ProposalService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
   /* this.isCopyChangeAct = this.config.isCopyChangeAct;
    this.isKeepAct = this.isCopyChangeAct;
    this.isNavigationAllowed = this.isKeepAct;
    this.nonEditablePartOfTitle =  this.config.nonEditablePartOfTitle;
    this.editableTitle =  this.config.editableTitle;
    this.proposalTemplate =  this.config.proposalTemplate;
    this.proposalRef =  this.config.proposalRef;
    this.proposalLanguage =  this.config.proposalLanguage;
    this.documentCollectionName =  this.config.documentCollectionName;
    this.userRoles =  this.config.userRoles;
    this.initCreateForm();
    if(this.isKeepAct){
      this.createForm.get('docPurpose').setValue(this.editableTitle + '-copy');
    }*/
    this.proposalService.loadCustomTemplateCatalog();
    this.initialize();
  }
  initialize() {
      this.proposalService.customTemplateCatalog$
        .pipe(takeUntil(this.destroy$))
        .subscribe((catalog) => {
          this.loadTemplates(catalog);
          this.cd.detectChanges(); // trigger `treeComponent` update
        });
  }

  private loadTemplates(catalogItems: CatalogItem[] | null) {
    catalogItems ??= [];
    this.templates = this.extractTemplatesFromCatalog(catalogItems);
    this.treeNodes = this.catalogToTreeNodes(catalogItems);
    this.filteredNodes = JSON.parse(JSON.stringify(this.treeNodes));
  }

  private extractTemplatesFromCatalog(catalogItems: CatalogItem[]) {
    const getChildTemplates = (item: CatalogItem): CatalogItem[] =>
      item.type === 'CATEGORY' ? item.items.flatMap(getChildTemplates) : [item];
    const templates = catalogItems.flatMap(getChildTemplates);
    return templates.reduce(
      (map, item) => map.set(item.key, item),
      new Map<string, CatalogItem>(),
    );
  }

  private catalogToTreeNodes(catalogItems: CatalogItem[]) {
    console.log(catalogItems);
    catalogItems.forEach(item => {
      // Access properties, e.g., item.visibleTo, item.someProperty
      console.log(item);
    });

    catalogItems = catalogItems.filter(item =>
      !item.hidden && (!item.visibleTo || item.visibleTo.trim() === '' ||
        (!this.userRoles?.length || item.visibleTo.split(',').some(role => this.userRoles.includes(role.toUpperCase().trim() as ApplicationRole))))
    );
    return catalogItems.map((item) => this.catalogItemToTreeItem(item));
  }

  private catalogItemToTreeItem(item: CatalogItem): TreeItemModel {
    const { id, documentCollection, key, names, customName, type, enabled, items, hidden, visibleTo } = item;
    let tooltipLabel = this.proposalService.getTranslation(names);
    const label = customName ? (key.substring(0, key.lastIndexOf('_')) + ' - ' + customName) : tooltipLabel;
    const iconClass =
      type === 'CATEGORY' ? iconClassCategory : iconClassTemplate;
    let disabled = !enabled;
    const children =
      type === 'CATEGORY' && !hidden && enabled
        ? items
          .filter((child) => !child.hidden &&
            (!child.visibleTo || child.visibleTo.trim() === '' ||
              (!this.userRoles?.length ||
                child.visibleTo.split(',').some(role => this.userRoles.includes(role.toUpperCase().trim() as ApplicationRole)))))
          .map((child) => this.catalogItemToTreeItem(child))
        : [];
    const isEmptyCategory = type === 'CATEGORY' && !children.length;
    const isTemplate = type !== 'CATEGORY';
    const sameTemplate = (this.proposalTemplate && key === this.proposalTemplate);
    const isSameDocCollection = (!this.isCopyChangeAct || documentCollection == this.documentCollectionName);
    disabled = disabled || this.disabled || !isSameDocCollection || sameTemplate;

    if(isEmptyCategory){
      tooltipLabel = 'empty-category';
    }else if(isTemplate){
      if(this.disabled){
        tooltipLabel = 'Invalid selection';
      }else if(!isSameDocCollection) {
        tooltipLabel = 'Invalid selection. Different category type';
      }else if(sameTemplate){
        tooltipLabel = 'Invalid selection. Cannot choose same template type';
      }
    }
    const node: TreeNode = {
      isExpanded: this.isExpanded,
      selectable: isTemplate && !this.disabled && isSameDocCollection && !sameTemplate,
      treeContentBlock: {
        id,
        key,
        label,
        disabled,
        iconSvgName: iconClass,
        tooltipLabel: tooltipLabel, // Adjust tooltipLabel based on conditions
        // Add other properties as needed
      },
    };

    return {
      node,
      children: isEmptyCategory ? undefined : children,
    };
  }


  onDocumentTypeFilter(documentType: string) {
    this.treeNodes = this.filterNodesByDocumentType(
      this.filteredNodes,
      documentType,
    );
  }
  private filterNodesByDocumentType(
    nodes: TreeDataModel | undefined,
    documentType: string,
  ): TreeDataModel {
    if (!nodes) {
      return [];
    }

    const documentTypeLower = documentType?.toLowerCase() ?? '';

    return nodes.reduce((acc: TreeDataModel, treeItem: TreeItemModel) => {
      const label = treeItem.node.treeContentBlock.label.toLowerCase();

      if (label && label.includes(documentTypeLower)) {
        return [...acc, treeItem];
      }

      const filteredChildren = this.filterNodesByDocumentType(
        treeItem.children,
        documentType,
      );
      if (filteredChildren.length > 0) {
        const newTreeItem: TreeItemModel = {
          node: treeItem.node,
          children: filteredChildren,
        };
        return [...acc, newTreeItem];
      }
      return acc;
    }, []);
  }

  toggleExpanded(expand = !this.isExpanded) {
    this.isExpanded = expand;
    if (this.isExpanded) {
      this.treeComponent.expandAll();
    } else {
      this.treeComponent.collapseAll();
    }
  }

  onNodeClick(event: EuiTreeSelectionChanges) {
    const selectedNode = event.selection[0];
    if (
      selectedNode &&
      this.templates.has(selectedNode.node.treeContentBlock.key)
    ) {
      this.setTemplate(
        this.templates.get(selectedNode.node.treeContentBlock.key),
      );
      // if (isDoubleClicked) {
      //   this.navigationClick.emit();
      // }
    } else {
      this.unsetTemplate();
    }
  }
  onclickAction(event) {

    const key: string = event.treeContentBlock.key;
    const delimiter: string = "_";

    const result: string[] = key.split(delimiter);
    const packageId: string = result[1];
    this.milestoneViewData.legFileId = packageId;
    this.proposalService.getDocumentRef(packageId)
      .pipe(
        switchMap(() => this.proposalService.documentRef$),
        takeUntil(this.destroy$)
      )
      .subscribe((documentRef) => {
        this.documentRef = documentRef;
      });


    console.log(this.documentRef);

  }

  private setTemplate(item: CatalogItem) {
    this.selectTemplate.emit(item);
    this.setLanguagesFromLangMap(item.languages);

    const codes = Object.keys(item.languages);
    const newLanguage = codes.includes(this.selectedLanguage)
      ? this.selectedLanguage
      : codes.includes(defaultLanguage)
        ? defaultLanguage
        : codes[0];
    if (this.selectedLanguage !== newLanguage) {
      this.onSelectLanguage(newLanguage);
    }
  }

  private setLanguagesFromLangMap(languages: Record<string, string>) {
    this.languages = Object.keys(languages).map((code) => ({
      code,
      label: languages[code],
    }));
  }

  private onSelectLanguage(code: string) {
    this.selectedLanguage = code;
    this.selectLanguage.emit(code);
  }

  private unsetTemplate() {
    this.languages = [];
    this.onSelectLanguage('');
  }

  onUpdateTemplate() {
    setTimeout(() => this.updateNameAndDgTemplateCatalog.openNameAndDgTemplateCatalog(this.documentRef), 0);
  }

  unPublishTemplateCatalog(event) {
    const key: string = event.treeContentBlock.key;
    const delimiter: string = "_";

    const result: string[] = key.split(delimiter);
    const packageId: string = result[1];
    setTimeout(() => this.updateNameAndDgTemplateCatalog.unPublishTemplateCatalog(packageId), 0);
  }

  viewTemplate() {
    if (this.documentRef) {
      this.router.navigate([`/collection/${this.documentRef}`]);
    }
  }
}
