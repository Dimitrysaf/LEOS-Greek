import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { appConfig } from 'src/config';

import {ApplicationRole, CatalogItem} from '@/shared';
import { ProposalService } from '@/shared/services/proposal.service';
import {
  EuiTreeComponent,
  TreeDataModel,
  TreeItemModel,
  TreeNode,
} from '@eui/components/eui-tree';
import { EuiTreeSelectionChanges } from '@eui/components/eui-tree/eui-tree.model';

const defaultLanguage =
  appConfig.global.i18n.i18nService.defaultLanguage.toUpperCase();
const iconClassCategory = 'folder:sharp';
const iconClassTemplate = 'document:sharp';

@Component({
  selector: 'app-proposal-create-template-selector',
  templateUrl: './proposal-create-template-selector.component.html',
  styleUrls: ['./proposal-create-template-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProposalCreateTemplateSelectorComponent
  implements OnInit, OnDestroy
{
  @Input() translationKey: 'document' | 'draft' = 'document';
  @Input() disabled: boolean = false;
  @Input() isCopyChangeAct!: boolean;
  @Input() documentCollectionName!: string;
  @Input() proposalTemplate!: string;
  @Input() userRoles!: ApplicationRole[];
  @Output() navigationClick = new EventEmitter<void>();
  @Output() selectTemplate = new EventEmitter<CatalogItem | null>();
  @Output() selectLanguage = new EventEmitter<string>();
  @ViewChild('treeComponent') treeComponent: EuiTreeComponent;
  event: Event;
  filterText: string;
  isExpanded: boolean;
  treeNodes: TreeDataModel = null;
  selectedLanguage: string;
  languages: Array<{ code: string; label: string }>;
  doubleClickTimer: any;
  filteredNodes: TreeDataModel = null;

  private destroy$ = new Subject<void>();
  private templates: Map<string, CatalogItem> = new Map();

  constructor(
    private cd: ChangeDetectorRef,
    private proposalService: ProposalService,
  ) {
    this.setInitialState();
  }

  ngOnInit() {
    this.initialize(this.isCopyChangeAct); // if isCopyChangeAct then default true for disabling the tree selection
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  reset() {
    this.isExpanded = true;
    this.selectedLanguage = '';
    this.languages = [];
    this.treeComponent.expandAll();
    //this.treeComponent.resetSelection();
    this.cd.detectChanges();
  }

  onDocumentTypeFilter(documentType: string) {
    this.treeNodes = this.filterNodesByDocumentType(
      this.filteredNodes,
      documentType,
    );
  }

  onLanguageChanged(langCode: string) {
    this.selectedLanguage = langCode;
    this.selectLanguage.emit(this.selectedLanguage);
  }

  toggleExpanded(expand = !this.isExpanded) {
    this.isExpanded = expand;
    if (this.isExpanded) {
      this.treeComponent.expandAll();
    } else {
      this.treeComponent.collapseAll();
    }
  }

  // simulateDoubleClick(node: TreeNode): void {
  //   const delay = 300; // Adjust the delay (in milliseconds) as needed
  //
  //   if (this.doubleClickTimer) {
  //     clearTimeout(this.doubleClickTimer);
  //     this.doubleClickTimer = null;
  //     // this.onNodeClick(node, true); // Handle the double click
  //   } else {
  //     this.doubleClickTimer = setTimeout(() => {
  //       this.doubleClickTimer = null;
  //       // this.onNodeClick(node); // Handle the single click
  //     }, delay);
  //   }
  // }


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

  resetInit(disabled: boolean){
    this.reset();
    this.initialize(disabled);
  }

  initialize(disabled:boolean) {
    this.disabled = disabled;
    this.proposalService.templateCatalog$
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

  /**
   * visibleTo is an optional attribute in catalog entries.
   *       It must be an array of valid EdiT roles (e.g., "support").
   *       If present and populated:
   *       The entry is shown only to users whose role matches one in the list.
   *       The entry is hidden from users whose role does not match.
   *       If the attribute is not present, the entry is visible to all users.
   *       Existing entries without visibleTo remain backward compatible.
   * @param catalogItems
   * @private
   */
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
    const { id, documentCollection, key, names, type, enabled, items, hidden, visibleTo } = item;
    const label = this.proposalService.getTranslation(names);
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

    let tooltipLabel = '';
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

  private setInitialState() {
    this.filterText = '';
    this.isExpanded = true;
    this.selectedLanguage = '';
    this.languages = [];
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

  private unsetTemplate() {
    this.languages = [];
    this.onSelectLanguage('');
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
}
