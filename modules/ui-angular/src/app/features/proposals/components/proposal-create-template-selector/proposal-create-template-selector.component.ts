import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UxLink } from '@eui/base';
import { UxTreeComponent } from '@eui/components/legacy/ux-tree';
import { Subject, takeUntil } from 'rxjs';
import { appConfig } from 'src/config';

import { CatalogItem } from '../../models';
import { ProposalService } from '../../services/proposal.service';

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
  @Output() selectTemplate = new EventEmitter<CatalogItem | null>();
  @Output() selectLanguage = new EventEmitter<string>();
  @ViewChild('treeComponent') treeComponent: UxTreeComponent;
  event: Event;
  filterText: string;
  isExpanded: boolean;
  treeNodes: UxLink[] = [];
  selectedLanguage: string;
  languages: Array<{ code: string; label: string }>;

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

  onNodeClick(node: UxLink) {
    if (this.templates.has(node.id)) {
      this.setTemplate(this.templates.get(node.id));
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
    return catalogItems.map((item) => this.catalogItemToUxLink(item));
  }

  private catalogItemToUxLink(item: CatalogItem): UxLink {
    const { id, names, type, enabled, items } = item;
    const label = this.proposalService.getTranslation(names);
    const iconClass =
      type === 'CATEGORY' ? iconClassCategory : iconClassTemplate;
    const disabled = !enabled;
    const children =
      type === 'CATEGORY' && enabled
        ? items
            .filter((child) => !child.hidden)
            .map((child) => this.catalogItemToUxLink(child))
        : [];

    return new UxLink({ id, label, iconClass, disabled, children });
  }

  private setInitialState() {
    this.filterText = '';
    this.isExpanded = false;
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
