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
import { UxLink } from '@eui/base';
import { UxTreeComponent } from '@eui/components/legacy/ux-tree';
import { Subject, takeUntil } from 'rxjs';
import { appConfig } from 'src/config';

import { CatalogItem } from '@/features/proposals/models';
import { ProposalService } from '@/features/proposals/services/proposal.service';

const defaultLanguage =
  appConfig.global.i18n.i18nService.defaultLanguage.toUpperCase();
const iconClassCategory = 'eui-icon eui-icon-folder';
const iconClassTemplate = 'eui-icon eui-icon-file';

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
  @Output() navigationClick = new EventEmitter<void>();
  @Output() selectTemplate = new EventEmitter<CatalogItem | null>();
  @Output() selectLanguage = new EventEmitter<string>();
  @ViewChild('treeComponent') treeComponent: UxTreeComponent;
  event: Event;
  filterText: string;
  isExpanded: boolean;
  treeNodes: UxLink[] = [];
  selectedLanguage: string;
  languages: Array<{ code: string; label: string }>;
  doubleClickTimer: any;

  private destroy$ = new Subject<void>();
  private templates: Map<string, CatalogItem> = new Map();

  constructor(
    private cd: ChangeDetectorRef,
    private proposalService: ProposalService,
  ) {
    this.setInitialState();
  }

  ngOnInit() {
    this.proposalService.templateCatalog$
      .pipe(takeUntil(this.destroy$))
      .subscribe((catalog) => {
        this.loadTemplates(catalog);
        this.cd.detectChanges(); // trigger `treeComponent` update
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  reset() {
    this.setInitialState();
    this.treeComponent.onFilter(this.filterText);
    this.treeComponent.onExpandAll(this.event);
    this.cd.detectChanges();
  }

  onLanguageChanged(langCode: string) {
    this.selectedLanguage = langCode;
    this.selectLanguage.emit(this.selectedLanguage);
  }

  toggleExpanded(expand = !this.isExpanded) {
    this.isExpanded = expand;
    if (this.isExpanded) {
      this.treeComponent.onExpandAll(this.event);
    } else {
      this.treeComponent.onCollapseAll(this.event);
    }
  }

  simulateDoubleClick(node: UxLink): void {
    const delay = 300; // Adjust the delay (in milliseconds) as needed

    if (this.doubleClickTimer) {
      clearTimeout(this.doubleClickTimer);
      this.doubleClickTimer = null;
      this.onNodeClick(node, true); // Handle the double click
    } else {
      this.doubleClickTimer = setTimeout(() => {
        this.doubleClickTimer = null;
        this.onNodeClick(node); // Handle the single click
      }, delay);
    }
  }

  onNodeClick(node: UxLink, isDoubleClicked = false) {
    if (this.templates.has(node.id)) {
      this.setTemplate(this.templates.get(node.id));
      if (isDoubleClicked) {
        this.navigationClick.emit();
      }
    } else {
      this.unsetTemplate();
    }
  }

  private loadTemplates(catalogItems: CatalogItem[] | null) {
    catalogItems ??= [];
    this.templates = this.extractTemplatesFromCatalog(catalogItems);
    this.treeNodes = this.catalogToTreeNodes(catalogItems);
  }

  private extractTemplatesFromCatalog(catalogItems: CatalogItem[]) {
    const getChildTemplates = (item: CatalogItem): CatalogItem[] =>
      item.type === 'CATEGORY' ? item.items.flatMap(getChildTemplates) : [item];
    const templates = catalogItems.flatMap(getChildTemplates);
    return templates.reduce(
      (map, item) => map.set(item.id, item),
      new Map<string, CatalogItem>(),
    );
  }

  private catalogToTreeNodes(catalogItems: CatalogItem[]) {
    catalogItems = catalogItems.filter((c) => !c.hidden);
    return catalogItems.map((item) => this.catalogItemToUxLink(item));
  }

  private catalogItemToUxLink(item: CatalogItem): UxLink {
    const { id, names, type, enabled, items, hidden } = item;
    const label = this.proposalService.getTranslation(names);
    const iconClass =
      type === 'CATEGORY' ? iconClassCategory : iconClassTemplate;
    const disabled = !enabled;
    const children =
      type === 'CATEGORY' && !hidden && enabled
        ? items
            .filter((child) => !child.hidden)
            .map((child) => this.catalogItemToUxLink(child))
        : [];
    const isEmptyCategory = type === 'CATEGORY' && !children.length;
    const isTemplate = type !== 'CATEGORY';
    return new UxLink({
      id,
      label,
      iconClass,
      disabled,
      expanded: this.isExpanded,
      children,
      ...(isEmptyCategory
        ? {
            // add a dummy child to force the toggle button to be displayed
            // then hide it using css, while keeping the indentation
            children: [new UxLink({ disabled: true, visible: false })],
            tooltipLabel: 'empty-category',
          }
        : {}),
      ...(isTemplate
        ? {
            // add a dummy child to force the toggle button to be displayed
            // then hide it using css, while keeping the indentation
            children: [new UxLink({ disabled: true, visible: false })],
            tooltipLabel: 'template',
          }
        : {}),
    });
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
}
