import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { Form, FormBuilder } from '@angular/forms';
import { UserDetails } from '@eui/base';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';

import {
  DocumentConfig,
  NumberingConfig,
  NumberingType,
} from '@/shared/models';
import { TableOfContentItemVO, TocItem } from '@/shared/models/toc.model';
import {
  convertArticle,
  findNodeById,
  getItemIndentLevel,
  getNumberingByName,
  getNumberingConfig,
  getTocItemByNumberingType,
} from '@/shared/utils/toc.utils';

const NUMBERED = 'Numbered';
const UNNUMBERED = 'Unnumbered';
const INDENT = 'INDENT';
const POINT = 'POINT';
const LIST = 'LIST';
const BULLET_NUM = 'BULLET_NUM';
const MAIN_BODY = 'MAIN_BODY';
const TYPING_TIME = 500;

@Component({
  selector: 'app-toc-editor',
  templateUrl: './toc-editor.component.html',
  styleUrls: ['./toc-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TocEditorComponent implements OnInit, OnChanges {
  @Input() documentType: string;
  @Input() toc: TableOfContentItemVO[];
  @Input() tocItems: TocItem[];
  @Input() selectedNode: TableOfContentItemVO;
  @Input() documentConfig: DocumentConfig;

  @Output() handleTocRemove = new EventEmitter<TableOfContentItemVO>();
  @Output() handleNodeChangesEvent = new EventEmitter<any>();
  @Output() handleInvalidNodes = new EventEmitter<Set<TableOfContentItemVO>>();

  isTocEditionInvalid: boolean;

  indentListRadioButtonGroupItemsToEnable: NumberingType[] = ['POINT_NUM'];
  isIndentListRadioButtonGroupEnabled: boolean;
  //division related
  active_division_style = 'style_1';
  active_point_style = '';
  active_block_style = '';
  active_paragraph_style = '';

  //article type
  previousHeading: string;
  previousType: string;
  restored: boolean;

  //environment var
  environment = process.env.NG_APP_LEOS_INSTANCE;

  //ng values for the selected node edit
  heading: string;
  number: string;
  numberConfig: NumberingConfig;
  type: string;
  tocType: string;
  possibleDivisionType: any[];

  invalidHeadingMsg: string;
  invalidNumberMsg: string;
  invalidCrossMsg: string;

  invalidNodes: Set<TableOfContentItemVO> = new Set();

  editorForm: Form;

  destroy$: Subject<any> = new Subject();
  private typingTimer;

  constructor(
    private translateService: TranslateService,
    private fb: FormBuilder,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedNode' in changes) {
      this.hanldeNodeSelect(changes.selectedNode.currentValue);
    }
  }

  ngOnInit(): void {}

  onTocRemove(node: TableOfContentItemVO) {
    this.handleTocRemove.emit(node);
  }

  isArticle(tocItem: TocItem) {
    return tocItem.aknTag.toLowerCase() === 'article';
  }

  isDivision(tocItem: TocItem) {
    return tocItem.aknTag.toLowerCase() === 'division';
  }

  isDivionStyleChecked(target: string) {
    return this.selectedNode.style === target;
  }

  isDivisionStyleEnabled(target: string) {
    return this.possibleDivisionType.indexOf(target) !== -1;
  }

  isIndentList(tocItem: TocItem) {
    return ['POINT', 'INDENT'].includes(tocItem.aknTag);
  }

  isCrossFading(tocItem: TocItem) {
    return tocItem.aknTag === 'BLOCK';
  }

  showTypeField(tocItem: TocItem) {
    return !['DIVISION'].includes(tocItem.aknTag);
  }

  isItemHeadingVisible(tocItem: TocItem) {
    return (
      tocItem.itemHeading === 'MANDATORY' || tocItem.itemHeading === 'OPTIONAL'
    );
  }
  isItemHeadingEditable(tocItem: TocItem) {
    return tocItem.aknTag === 'DIVISION'
      ? false
      : this.isItemHeadingVisible(tocItem);
  }

  isHeadingItemMandatory(node: TableOfContentItemVO) {
    return node.tocItem.itemHeading === 'MANDATORY';
  }

  isItemNumberEditable(tocItem: TocItem) {
    return tocItem.numberEditable;
  }

  isItemNumberVisible(tocItem: TocItem) {
    return (
      tocItem.itemNumber === 'MANDATORY' || tocItem.itemNumber === 'OPTIONAL'
    );
  }

  isItemNumberMandatory(tocItem: TocItem) {
    return tocItem.itemNumber === 'MANDATORY';
  }

  getTocItemMessageValidationError(
    node: TableOfContentItemVO,
    fieldName: string,
  ) {
    const config = getNumberingByName(
      this.documentConfig.numberingConfig,
      node.tocItem.numberingType,
    );

    switch (fieldName) {
      case 'heading':
        return this.translateService.instant(
          'toc.edit.window.item.selected.heading.error.message',
        );
      case 'number':
        if (node.number.length === 0)
          return this.translateService.instant(
            'toc.edit.window.item.selected.number.error.message',
          );
        return this.translateService.instant(config.msgValidationError);
      case 'cross':
        return '';
    }
  }

  showNumParagraphToggle(item: TableOfContentItemVO) {
    const env = process.env.NG_APP_LEOS_INSTANCE;
    return (
      item.originAttr &&
      item.originAttr === 'ec' &&
      item.tocItem.aknTag === 'ARTICLE' &&
      item.childItems.length > 0 &&
      !(item.softActionAttr === 'DELETE' || item.softActionAttr === 'MOVE')
    );
  }

  hanldeNodeSelect(node: TableOfContentItemVO) {
    this.invalidHeadingMsg = null;
    this.invalidNumberMsg = null;
    this.invalidCrossMsg = null;
    this.selectedNode = node;
    this.heading = node.heading;
    this.type = this.getDisplayableTocItem(node.tocItem);
    this.number = node.number;
    this.numberConfig = getNumberingByName(
      this.documentConfig.numberingConfig,
      node.tocItem.numberingType,
    );
    this.tocType = node.tocItemType?.toLowerCase();
    //enable identListRadioButton
    if (
      this.indentListRadioButtonGroupItemsToEnable != null &&
      ['annex', 'bill'].includes(this.documentType)
    ) {
      this.isIndentListRadioButtonGroupEnabled =
        this.indentListRadioButtonGroupItemsToEnable.includes(
          node.tocItem.numberingType,
        );
    }

    if (this.isDivision(node.tocItem)) {
      this.active_division_style = node.style;
      this.possibleDivisionType = this.getDivisionTypesToEnable(
        this.getPreviousDivisionType(node),
      );
    }
    if (this.isIndentList(node.tocItem)) {
      this.active_point_style = node.tocItem.numberingType;
    }
    if (this.isCrossFading(node.tocItem)) {
      this.active_block_style = node.tocItem.numberingType;
    }
    if (this.showNumParagraphToggle(node)) {
      this.active_paragraph_style =
        node.childItems?.[0]?.number?.length > 0
          ? NUMBERED
          : UNNUMBERED ?? UNNUMBERED;
    }
  }

  handleHeadingChange(value: string) {
    clearTimeout(this.typingTimer);
    const newTree = cloneDeep(this.toc);
    this.typingTimer = setTimeout(() => {
      if (
        this.selectedNode.tocItem.itemHeading === 'OPTIONAL' ||
        (this.selectedNode.tocItem.itemHeading === 'MANDATORY' && value)
      ) {
        //save snapshot of previous tree
        this.handleNodeChanges(newTree, true);
        //remove previous invalid node
        this.removeInvalidNode();
        this.invalidHeadingMsg = null;
        this.previousHeading = this.heading;
        this.selectedNode.heading = value;
        if (this.environment === 'ec') {
          this.selectedNode.originHeadingAttr = 'DELETE';
          this.selectedNode.originHeadingAttr = 'ec';
        }
        this.invalidNodes.delete(this.selectedNode);
        this.handleInvalidNodes.emit(this.invalidNodes);
      } else {
        this.selectedNode.heading = value;
        this.invalidHeadingMsg = this.getTocItemMessageValidationError(
          this.selectedNode,
          'heading',
        );
        this.invalidNodes.add(this.selectedNode);
        this.handleInvalidNodes.emit(this.invalidNodes);
      }
      //set new tree
      let newSelectedNode = findNodeById(newTree, this.selectedNode.id);
      newSelectedNode = this.selectedNode;
      this.handleNodeChanges(newTree);
    }, TYPING_TIME);
  }

  removeInvalidNode() {
    for (const node of this.invalidNodes) {
      if (node.id === this.selectedNode.id) {
        this.invalidNodes.delete(node);
        this.handleInvalidNodes.emit(this.invalidNodes);
        return;
      }
    }
  }

  handleNumberChange(number: string) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      const newTree = cloneDeep(this.toc);
      let newSelectedNode = findNodeById(newTree, this.selectedNode.id);
      const numberRegex = this.numberConfig.regex;
      if (number && numberRegex.match(number)) {
        //clear invalid
        this.removeInvalidNode();
        //save snapshot of old tree
        this.handleNodeChanges(newTree, true);
        this.invalidNumberMsg = null;
        this.selectedNode.isAutoNumOverwritten = true;
        this.selectedNode.number = number;
        this.invalidNodes.delete(this.selectedNode);
        this.handleInvalidNodes.emit(this.invalidNodes);
      } else {
        this.invalidNumberMsg = this.getTocItemMessageValidationError(
          this.selectedNode,
          'number',
        );
        this.selectedNode.number = number;
        this.invalidNodes.add(this.selectedNode);
        this.handleInvalidNodes.emit(this.invalidNodes);
      }
      //handle node changes
      newSelectedNode = this.selectedNode;
      this.handleNodeChanges(newTree);
    }, TYPING_TIME);
  }

  handleParagraphToggle(event) {
    const newTree = cloneDeep(this.toc);
    const { value } = event.target;
    //save snapshot of old tree
    this.handleNodeChanges(newTree, true);
    if (
      this.selectedNode.childItems &&
      this.selectedNode.childItems.length > 0
    ) {
      // const newSelectedNode = findNodeById(newTree, this.selectedNode.id);
      //no  need to check if children exists the flow requires it
      const firstChild = this.selectedNode.childItems.at(0);
      let flag = false;
      for (const itemVo of this.selectedNode.childItems) {
        if (itemVo.numSoftActionAttr && itemVo.numSoftActionAttr !== 'DELETE') {
          flag = true;
          break;
        }
      }
      if (value === NUMBERED) {
        if (!firstChild.number || flag) {
          this.selectedNode.numberingToggled = true;
          for (const n of this.selectedNode.childItems) {
            n.number = '#';
          }
          this.handleNodeChanges(newTree);
        }
      } else if (value === UNNUMBERED) {
        if (firstChild.number && !flag) {
          this.selectedNode.numberingToggled = false;
          for (const n of this.selectedNode.childItems) {
            n.number = null;
          }
          this.handleNodeChanges(newTree);
        }
      }
    }
  }

  handleListRadioButton(event) {
    const { value } = event.target;
    const oldValue = this.selectedNode.tocItem.numberingType;
    this.active_block_style = value;

    const newTree = cloneDeep(this.toc);
    //save snapshot of old tree
    this.handleNodeChanges(newTree, true);
    // const newSelectedNode = findNodeById(newTree, this.selectedNode.id);
    const numberConfig = getNumberingConfig(
      this.documentConfig.numberingConfig,
      value,
    );
    const newTocItem = getTocItemByNumberingType(
      this.tocItems,
      value,
      this.selectedNode.tocItem.aknTag,
    );
    this.selectedNode.tocItem = newTocItem;
    this.selectedNode.number = numberConfig.sequence;
    this.handleNodeChanges(newTree);
  }

  handleIndentListRadioButtonGroupChange(event) {
    const { value } = event.target;
    const oldValue = this.selectedNode.tocItem.numberingType;
    this.active_point_style = value;
    const newTree = cloneDeep(this.toc);
    //save snapshot of old tree
    this.handleNodeChanges(newTree, true);
    const newTocItem = getTocItemByNumberingType(this.tocItems, value, INDENT);
    // const newSelectedNode = findNodeById(newTree, this.selectedNode.id);
    const parentNode = findNodeById(newTree, this.selectedNode.parentItem);
    this.propagateListType(
      newTree,
      this.findRootList(newTree, this.selectedNode),
      newTocItem,
    );
    this.handleNodeChanges(newTree);
  }

  handleDivisionChange(event: any) {
    const newTree = cloneDeep(this.toc);
    //save snapshot of old tree
    this.handleNodeChanges(newTree, true);
    const newSelectedNode = findNodeById(newTree, this.selectedNode.id);
    const { value } = event.target;
    this.selectedNode.style = value;
    this.active_division_style = value;
    this.handleNodeChanges(newTree);
  }

  handleListRadioButtonGroupChange(event: string) {
    const numberingConfig = getNumberingConfig(
      this.documentConfig.numberingConfig,
      event as NumberingType,
    );
    const newTree = cloneDeep(this.toc);
    //save snapshot of old tree
    this.handleNodeChanges(newTree, true);
    const newSelectedNode = findNodeById(newTree, this.selectedNode.id);
    this.selectedNode.tocItem = getTocItemByNumberingType(
      this.tocItems,
      event as NumberingType,
      this.selectedNode.tocItem.aknTag,
    );
    this.selectedNode.number = numberingConfig.sequence;
    this.handleNodeChanges(newTree);
  }

  handleTypeChange(event: string) {
    const oldHeading = this.heading;
    const oldValue = this.selectedNode.tocItemType;
    this.tocType = event;
    const newTree = cloneDeep(this.toc);
    //save snapshot of old tree
    this.handleNodeChanges(newTree, true);

    this.selectedNode.tocItemType = event.toUpperCase();

    convertArticle(
      this.tocItems,
      this.selectedNode,
      oldValue.toUpperCase(),
      event.toUpperCase(),
    );

    if (
      this.previousType &&
      this.previousType.toLowerCase() === event.toLowerCase()
    ) {
      this.selectedNode.isAffected = false;
      if (oldHeading !== '') {
        this.heading = this.previousHeading;
        this.selectedNode.heading = this.heading;
      } else {
        this.heading = this.translateService.instant(
          'toc.item.type.' + this.selectedNode.tocItemType + '.article.heading',
        );
        this.selectedNode.heading = this.heading;
      }
    } else {
      this.selectedNode.isAffected = false;
      this.heading = this.translateService.instant(
        'toc.item.type.' +
          this.selectedNode.tocItemType.toLowerCase() +
          '.article.heading',
      );
      this.selectedNode.heading = this.heading;
    }

    //save the old value
    this.previousType = oldValue;
    this.previousHeading = oldHeading;
    this.handleNodeChanges(newTree);
  }

  //save snapshot is introduced to reduce the number of re-renderings for the tree
  handleNodeChanges(newTree: TableOfContentItemVO[], saveSnapshot?: boolean) {
    this.handleNodeChangesEvent.emit({ newTree, saveSnapshot });
  }

  private getSoftUserAttribute(user: UserDetails) {
    return `${user.firstName} (${user['getDefaultEntity'] ?? ''})`;
  }

  private getNewNumberingFromListTocItem(
    list: TableOfContentItemVO[],
    tocItem: TocItem,
    numberingConfigs: NumberingConfig[],
  ) {
    let sequence = '#';
    const config = getNumberingConfig(numberingConfigs, tocItem.numberingType);
    if (list && list.length > 0 && config && !config.numbered) {
      const firstChild = list.at(0);
      if (config && (!config.levels || config.levels.levels.length === 0)) {
        sequence = config.prefix + config.sequence + config.suffix;
      } else if (config && config.levels && config.levels.levels.length > 0) {
        const level = 0;
        getItemIndentLevel(
          this.toc,
          findNodeById(this.toc, firstChild.parentItem),
          level,
          [POINT, INDENT],
        );
        if (level >= 0 && level < config.levels.levels.length) {
          const numberingLevel = config.levels.levels.at(level);
          const numberingConfigLevel = getNumberingConfig(
            numberingConfigs,
            numberingLevel.numberingType,
          );
          if (numberingConfigLevel)
            sequence =
              numberingConfigLevel.prefix +
              numberingConfigLevel.sequence +
              numberingConfigLevel.suffix;
        }
      }
    }
    return sequence;
  }

  private findChildLists(item: TableOfContentItemVO) {
    let childLists: TableOfContentItemVO[] = [];
    const childItems = item.childItems.filter((n) =>
      ['POINT', 'INDENT'].includes(n.tocItem.aknTag),
    );
    if (childItems && childItems.length > 0) {
      childLists = [...childItems];
    } else {
      for (const child of item.childItems) {
        if (child.tocItem.aknTag === 'LIST') {
          const filtered = item.childItems.filter((n) =>
            ['POINT', 'INDENT'].includes(n.tocItem.aknTag),
          );
          filtered.forEach((n) => childLists.push(n));
        }
      }
    }
    return childLists;
  }

  private findRootList(
    root: TableOfContentItemVO[],
    item: TableOfContentItemVO,
  ) {
    let tmpItem = item;
    let parentItem = findNodeById(root, item.parentItem);
    while (
      parentItem &&
      (parentItem.tocItem.aknTag === LIST ||
        parentItem.tocItem.aknTag === POINT ||
        parentItem.tocItem.aknTag === INDENT)
    ) {
      tmpItem = parentItem;
      parentItem = findNodeById(root, parentItem.parentItem);
    }
    if (tmpItem.tocItem.aknTag !== LIST)
      tmpItem = findNodeById(root, tmpItem.parentItem);
    return tmpItem.childItems.filter((n) =>
      [POINT, INDENT].includes(n.tocItem.aknTag),
    );
  }

  private getDivisionTypesToEnable(previousDivisionType) {
    const possibleDivisions = [];
    while (previousDivisionType >= 0) {
      possibleDivisions.push('type_' + previousDivisionType);
      previousDivisionType--;
    }
    if (possibleDivisions.length <= 0) {
      possibleDivisions.push('type_1');
    }
    return possibleDivisions;
  }

  private propagateListType(
    root: TableOfContentItemVO[],
    list: TableOfContentItemVO[],
    newTocItem: TocItem,
  ) {
    const newNumberingValue = this.getNewNumberingFromListTocItem(
      list,
      newTocItem,
      this.documentConfig.numberingConfig,
    );
    for (const n of list) {
      if (n.tocItem.aknTag === POINT || n.tocItem.aknTag === INDENT) {
        n.tocItem = newTocItem;
        n.number = newNumberingValue;

        this.propagateListType(root, this.findChildLists(n), newTocItem);
      }
    }
  }

  private getDisplayableTocItem(tocItem: TocItem): string {
    if (tocItem.numberingType === BULLET_NUM) {
      return this.translateService.instant('toc.item.type.bullet');
    }
    if (tocItem.aknTag === MAIN_BODY) {
      return this.translateService.instant('toc.item.type.mainbody');
    }
    return this.translateService.instant(
      'toc.item.type.' + tocItem.aknTag.toLowerCase(),
    );
  }

  private getNumberToggleValue(item: TableOfContentItemVO) {
    let toggleValue;
    const firstChild = item.childItems.at(0);
    if (firstChild.number?.length > 0 && item.numSoftActionAttr !== 'DELETE') {
      toggleValue = NUMBERED;
    }
    toggleValue = UNNUMBERED;
    return toggleValue;
  }

  private getPreviousDivisionType(node: TableOfContentItemVO) {
    const parentNode = findNodeById(this.toc, node.parentItem);
    const divisionNodes = parentNode.childItems.filter(
      (n) => n.tocItem.aknTag === 'DIVISION',
    );
    const index = divisionNodes.indexOf(node);
    if (index > 0) {
      const previousDivision = divisionNodes.at(index - 1);
      const previousDivisionStyle = previousDivision.style;
      return (
        parseInt(
          previousDivisionStyle.substring(
            previousDivisionStyle.indexOf('_') + 1,
          ),
          10,
        ) + 1
      );
    }
    return -1;
  }
}
