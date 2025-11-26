import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { getI18nState } from '@eui/core';
import { CatalogItem} from '@leos/shared';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  skip,
  Subject,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';

import {
  MAX_TRUNCATION_LIMIT,
  ONE_LINE_NODE_LABEL_LENGTH,
} from '@/shared/constants/toc.constant';
import { ProposalService } from '@/shared/services/proposal.service';

import {
  FilterOption,
  ProposalFilter,
  ProposalFilterGroup,
} from '../../models';
import {AppConfigService} from "@/core/services/app-config.service";
import {EuiTreeComponent, TreeDataModel, TreeItemModel, TreeNode} from "@eui/components/eui-tree";
import {EuiTreeSelectionChanges} from "@eui/components/eui-tree/eui-tree.model";
import {appConfig} from "../../../../../config";
const iconClassCategory = 'folder:sharp';
const iconClassTemplate = 'document:sharp';
const defaultLanguage =
  appConfig.global.i18n.i18nService.defaultLanguage.toUpperCase();
@Component({
  selector: 'app-proposals-filters',
  templateUrl: './proposals-filters.component.html',
  styleUrls: ['./proposals-filters.component.scss'],
})
export class ProposalsFiltersComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  static get emptyFilterParams(): ProposalFilter {
    return {
      searchTerm: '',
      procedures: [],
      acts: [],
      templates: [],
      roles: [],
      customTemplates: ''
    };
  }

  @ViewChild('filtersContainer') filtersContainer: ElementRef<HTMLElement>;
  @ViewChild('treeComponent') treeComponent: EuiTreeComponent;
  filterGroups: ProposalFilterGroup[] = [];
  form: FormGroup;

  private resizeObserver: ResizeObserver;
  private formChangesSub: Subscription;
  private destroy$ = new Subject<void>();
  private canCreateTemplate: boolean = false;
  treeNodes: TreeDataModel = null;
  filteredNodes: TreeDataModel = null;
  isExpanded: boolean;
  private templates: Map<string, CatalogItem> = new Map();
  selectedLanguage: string;
  languages: Array<{ code: string; label: string }>;
  filterText: string;

  selectedTemplates: any[] =[];


  constructor(
    private fb: FormBuilder,
    private proposalService: ProposalService,
    private translateService: TranslateService,
    private store: Store<any>,
    private appConfig: AppConfigService,
    private cdRef: ChangeDetectorRef
  ) {
    this.setInitialState();
  }

  private setInitialState() {
    this.filterText = '';
    this.isExpanded = true;
    this.selectedLanguage = '';
    this.languages = [];
    this.selectedTemplates = [];
  }

  ngOnInit(): void {
    const templateCatalog$ = this.proposalService.templateCatalog$.pipe(
      takeUntil(this.destroy$),
    );
    const i18nState$ = this.store
      .select(getI18nState)
      .pipe(takeUntil(this.destroy$));
    const filters$ = this.proposalService.filters$.pipe(
      takeUntil(this.destroy$),
    );

    combineLatest([
      templateCatalog$.pipe(take(1)),
      i18nState$.pipe(take(1)),
      filters$.pipe(take(1)),
    ]).subscribe(([catalog]) => {
      this.setupFilterGroups(catalog);
     });

    this.appConfig.config.subscribe((config) => {
      this.canCreateTemplate = config.userAppPermissions.includes('CAN_CREATE_TEMPLATE');
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSubmit(event: Event) {
    event.preventDefault();
  }

  resetFilters() {
    this.resetSelectedTree(this.treeNodes);
    this.setInitialState();
    this.treeNodes = [...this.treeNodes]; // new array reference
    this.proposalService.setFilters(
      ProposalsFiltersComponent.emptyFilterParams,
    );
  }

  isLabelTextMoreThanOneLine(label: string) {
    return label.length >= ONE_LINE_NODE_LABEL_LENGTH;
  }

  private setupFilterGroups(catalog: CatalogItem[]) {
    this.createTreeNode(catalog);
    //this.filterGroups = this.createFilters(catalog);
  }
  private createTreeNode(catalogItems: CatalogItem[]) {
    this.templates = this.extractTemplatesFromCatalog(catalogItems);
    this.treeNodes = this.catalogToTreeNodes(catalogItems);
    this.filteredNodes = JSON.parse(JSON.stringify(this.treeNodes));
    //this.assignParents(this.treeNodes, null);
  }

  private catalogToTreeNodes(catalogItems: CatalogItem[]) {
    console.log(catalogItems);
    catalogItems.forEach(item => {
      // Access properties, e.g., item.visibleTo, item.someProperty
      console.log(item);
    });

    catalogItems = catalogItems.filter(item =>
      !item.hidden && (!item.visibleTo || item.visibleTo.trim() === ''
       /* ||(!this.userRoles?.length || item.visibleTo.split(',').some(role => this.userRoles.includes(role.toUpperCase().trim() as ApplicationRole)))*/
        )
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
            (!child.visibleTo || child.visibleTo.trim() === ''
             /* || (!this.userRoles?.length ||
                child.visibleTo.split(',').some(role => this.userRoles.includes(role.toUpperCase().trim() as ApplicationRole)))*/
            ))
          .map((child) => this.catalogItemToTreeItem(child))
        : [];
    const isEmptyCategory = type === 'CATEGORY' && !children.length;
    const isTemplate = type !== 'CATEGORY';
    const node: TreeNode = {
      isExpanded: this.isExpanded,
      selectable: isTemplate,
      treeContentBlock: {
        id,
        key,
        label,
        disabled,
        iconSvgName: iconClass,
      },
    };

    return {
      node,
      children
    };
  }

  private extractTemplatesFromCatalog(catalogItems: CatalogItem[]) {
    const getChildTemplates = (item: CatalogItem): CatalogItem[] =>
      (item.type === 'CATEGORY' || item.type === 'ACT' || item.type === 'PROCEDURE') ? item.items.flatMap(getChildTemplates) : [item];
    const templates = catalogItems.flatMap(getChildTemplates);
    return templates.reduce(
      (map, item) => map.set(item.key, item),
      new Map<string, CatalogItem>(),
    );
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
    } else {
      this.unsetTemplate();
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

  private setTemplate(item: CatalogItem) {
   // this.selectTemplate.emit(item);
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

  private onSelectLanguage(code: string) {
    this.selectedLanguage = code;
    //this.selectLanguage.emit(code);
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

  resetSelectedTree(nodes: TreeDataModel) {
    nodes?.forEach((n) => {
      n.node.isSelected = false;
      this.resetSelectedTree(n.children);
    });
  }
  // Called when a node is clicked in template
  onSelectNode(event: any, nodeKey: string) {
    this.selectedTemplates = [];
    this.resetSelectedTree(this.treeNodes);
    const wrapperNode = this.findWrapperNode(this.treeNodes, nodeKey);
    if (!wrapperNode) return;

    this.toggleNodeSelection(wrapperNode, event.target.checked);

    this.treeNodes = [...this.treeNodes]; // new array reference
    this.cdRef.detectChanges();
    this.proposalService.updateTemplates(this.selectedTemplates);

  }

  // Recursive search in tree by node key
  findWrapperNode(nodes: any[], key: string): any {
    for (const wrapper of nodes) {
      if (wrapper.node.treeContentBlock.key === key) return wrapper;
      if (wrapper.children && wrapper.children.length) {
        const found = this.findWrapperNode(wrapper.children, key);
        if (found) return found;
      }
    }
    return null;
  }

  // Toggle selection for node and all children
  toggleNodeSelection(wrapperNode: any, isSelected: boolean) {
    wrapperNode.node.isSelected = isSelected;
    wrapperNode.node.isIndeterminate = false;
    if (wrapperNode.node.selectable && wrapperNode.node.isSelected ) {
      this.selectedTemplates.push(wrapperNode.node.treeContentBlock.key);
    }

    if (wrapperNode.children && wrapperNode.children.length) {
      wrapperNode.children.forEach(child => this.toggleNodeSelection(child, isSelected));
    }
  }
}
