import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SecurityContext,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Form, FormBuilder } from '@angular/forms';
import { UserDetails } from '@eui/base';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import {
  ARTICLE,
  BLOCK,
  BULLET_NUM,
  CROSSHEADING,
  DELETE,
  DIVISION,
  EC,
  HASH_NUM_VALUE,
  INDENT,
  LIST,
  MAIN_BODY,
  NUMBERED,
  POINT,
  UNNUMBERED,
} from '@/shared/constants';
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
  isDeletableItem,
  isDeletedItem,
  isMoveToItem,
  isUndeletableItem,
  updateDepthOfTocItems,
} from '@/shared/utils/toc.utils';
import { DomSanitizer } from '@angular/platform-browser';

const TYPING_TIME = 500;
const OPEN_TAG = '<';
const CLOSE_TAG = '>';

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
  content: string;
  number: string;
  numberConfig: NumberingConfig;
  type: string;
  tocType: string;
  possibleDivisionType: any[];
  isDeleteButtonEnabled: boolean;
  deleteType: string;
  deleteButtonCaption: string;

  invalidContentMsg: string;
  invalidHeadingMsg: string;
  invalidNumberMsg: string;
  invalidCrossMsg: string;

  invalidNodes: Set<TableOfContentItemVO> = new Set();

  editorForm: Form;

  destroy$: Subject<any> = new Subject();
  private typingTimer;
  private numberInvalid = false;
  private headingInvalid = false;
  private contentInvalid = false;

  constructor(
    private translateService: TranslateService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
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
    return tocItem.aknTag.toLowerCase() === ARTICLE.toLowerCase();
  }

  isDivision(tocItem: TocItem) {
    return tocItem.aknTag.toLowerCase() === DIVISION.toLowerCase();
  }

  isDivionStyleChecked(target: string) {
    return this.selectedNode.style === target;
  }

  isDivisionStyleEnabled(target: string) {
    return this.possibleDivisionType.indexOf(target) !== -1;
  }

  isIndentList(tocItem: TocItem) {
    return [POINT, INDENT].includes(tocItem.aknTag);
  }

  isCrossHeading(tocItem: TocItem) {
    return tocItem.aknTag === CROSSHEADING;
  }

  showTypeField(tocItem: TocItem) {
    return ![DIVISION].includes(tocItem.aknTag);
  }

  isItemHeadingVisible(tocItem: TocItem) {
    return (
      tocItem.itemHeading === 'MANDATORY' || tocItem.itemHeading === 'OPTIONAL'
    );
  }

  isItemHeadingEditable(tocItem: TocItem) {
    return tocItem.aknTag === DIVISION
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
        if (node.number?.length === 0)
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
      item.originAttr === EC &&
      item.tocItem.aknTag === ARTICLE &&
      item.childItems.length > 0 &&
      !(item.softActionAttr === DELETE || item.softActionAttr === 'MOVE')
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
    this.content = node.content;
    this.numberConfig = getNumberingByName(
      this.documentConfig.numberingConfig,
      node.tocItem.numberingType,
    );
    this.tocType = node.tocItemType?.toLowerCase();
    const deletedItem = isDeletedItem(node) || isMoveToItem(node);
    // If toc item is configured to be deletable, then check:
    // - if the item has already been deleted => check if it can be undelete
    // - if has not been deleted => check if it can be deleted (Ex: when mixed EC/CN element are present)
    this.isDeleteButtonEnabled =
      node.tocItem.deletable &&
      (deletedItem
        ? isUndeletableItem(this.toc, node)
        : isDeletableItem(this.toc, node));

    if (deletedItem) {
      this.deleteButtonCaption = this.translateService.instant(
        'global.actions.undelete',
      );
      this.deleteType = 'undelete';
    }
    if (!deletedItem) {
      this.deleteButtonCaption = this.translateService.instant(
        'global.actions.delete',
      );
      this.deleteType = 'delete';
    }

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
      this.active_division_style = node.autoNumOverwritten ? null : node.style;
      this.possibleDivisionType = this.getDivisionTypesToEnable(
        this.getPreviousDivisionType(node),
      );
    }
    if (this.isIndentList(node.tocItem)) {
      this.active_point_style = node.tocItem.numberingType;
    }
    if (this.isCrossHeading(node.tocItem)) {
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
    this.typingTimer = setTimeout(() => {
      if (
        this.selectedNode.tocItem.itemHeading === 'OPTIONAL' ||
        (this.selectedNode.tocItem.itemHeading === 'MANDATORY' && value)
      ) {
        //clear invalid
        if (!this.numberInvalid) {
          this.removeInvalidNode();
          this.invalidNodes.delete(this.selectedNode);
          this.handleInvalidNodes.emit(this.invalidNodes);
        }
        //save snapshot of previous tree
        this.handleNodeChanges(this.toc, true);
        this.invalidHeadingMsg = null;
        this.previousHeading = this.heading;
        this.selectedNode.heading = value;
        if (this.environment === 'ec') {
          this.selectedNode.originHeadingAttr = 'DELETE';
          this.selectedNode.originHeadingAttr = 'ec';
        }
        this.headingInvalid = false;
      } else {
        this.selectedNode.heading = value;
        this.invalidHeadingMsg = this.getTocItemMessageValidationError(
          this.selectedNode,
          'heading',
        );
        this.invalidNodes.add(this.selectedNode);
        this.headingInvalid = true;
        this.handleInvalidNodes.emit(this.invalidNodes);
      }

      this.handleNodeChanges(this.toc);
    }, TYPING_TIME);
  }

  handleContentChange(value: string) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      //validate contet typed
      if (value.length === 0) {
        this.handleNodeChanges(this.toc, true);
        this.invalidContentMsg = this.translateService.instant(
          'toc.edit.window.item.selected.content.empty.message',
        );
        this.contentInvalid = true;
        this.invalidNodes.add(this.selectedNode);
        this.handleInvalidNodes.emit(this.invalidNodes);
      } else if (this.containsXmlTags(value)) {
        this.handleNodeChanges(this.toc, true);
        this.invalidContentMsg = this.translateService.instant(
          'toc.edit.window.item.selected.content.error.message',
        );
        this.contentInvalid = true;
        this.invalidNodes.add(this.selectedNode);
        this.handleInvalidNodes.emit(this.invalidNodes);
      } else {
        this.handleNodeChanges(this.toc, true);
        this.invalidNodes.delete(this.selectedNode);
        this.handleInvalidNodes.emit(this.invalidNodes);
        this.invalidContentMsg = null;
        this.contentInvalid = false;
        this.selectedNode.content = this.sanitizer.sanitize(
          SecurityContext.HTML,
          value,
        );
      }
      this.handleNodeChanges(this.toc);
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
      const numberRegex = RegExp(this.numberConfig.regexJS);
      if (number && numberRegex.test(number)) {
        //clear invalid
        if (!this.numberInvalid) {
          this.removeInvalidNode();
          this.invalidNodes.delete(this.selectedNode);
          this.handleInvalidNodes.emit(this.invalidNodes);
        }
        //save snapshot of old tree
        this.handleNodeChanges(this.toc, true);
        this.invalidNumberMsg = null;
        this.selectedNode.autoNumOverwritten = true;
        this.selectedNode.number = number;
        this.numberInvalid = false;
      } else {
        this.invalidNumberMsg = this.getTocItemMessageValidationError(
          this.selectedNode,
          'number',
        );
        this.selectedNode.number = number;
        this.invalidNodes.add(this.selectedNode);
        this.numberInvalid = true;
        this.handleInvalidNodes.emit(this.invalidNodes);
      }
      this.handleNodeChanges(this.toc);
    }, TYPING_TIME);
  }

  handleParagraphToggle(event) {
    const newSelectedNode = findNodeById(this.toc, this.selectedNode.id);
    const { value } = event.target;
    //save snapshot of old tree
    this.handleNodeChanges(this.toc, true);
    if (
      this.selectedNode.childItems &&
      this.selectedNode.childItems.length > 0
    ) {
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
          newSelectedNode.numberingToggled = true;
          for (const n of newSelectedNode.childItems) {
            n.number = '#';
          }
          this.handleNodeChanges(this.toc);
        }
      } else if (value === UNNUMBERED) {
        if (firstChild.number && !flag) {
          newSelectedNode.numberingToggled = false;
          for (const n of newSelectedNode.childItems) {
            n.number = null;
          }
          this.handleNodeChanges(this.toc);
        }
      }
    }
  }

  handleListRadioButton(event) {
    const { value } = event.target;
    const oldValue = this.selectedNode.tocItem.numberingType;
    this.active_block_style = value;
    //save snapshot of old tree
    this.handleNodeChanges(this.toc, true);
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
    this.handleNodeChanges(this.toc);
  }

  handleIndentListRadioButtonGroupChange(event) {
    const { value } = event.target;
    const oldValue = this.selectedNode.tocItem.numberingType;
    this.active_point_style = value;

    //save snapshot of old tree
    this.handleNodeChanges(this.toc, true);
    const newTocItem = getTocItemByNumberingType(this.tocItems, value, INDENT);
    const parentNode = findNodeById(this.toc, this.selectedNode.parentItem);
    this.propagateListType(
      this.toc,
      this.findRootList(this.toc, this.selectedNode),
      newTocItem,
    );
    this.handleNodeChanges(this.toc);
  }

  handleDivisionChange(event: any) {
    //save snapshot of old tree
    this.handleNodeChanges(this.toc, true);
    const { value } = event.target;
    this.selectedNode.style = value;
    this.active_division_style = value;
    this.selectedNode.autoNumOverwritten = false;
    updateDepthOfTocItems(this.selectedNode.childItems);
    this.selectedNode.number = HASH_NUM_VALUE;
    this.handleNodeChanges(this.toc);
  }

  handleListRadioButtonGroupChange(event: string) {
    const numberingConfig = getNumberingConfig(
      this.documentConfig.numberingConfig,
      event as NumberingType,
    );

    //save snapshot of old tree
    this.handleNodeChanges(this.toc, true);
    this.selectedNode.tocItem = getTocItemByNumberingType(
      this.tocItems,
      event as NumberingType,
      this.selectedNode.tocItem.aknTag,
    );
    this.selectedNode.number = numberingConfig.sequence;
    this.handleNodeChanges(this.toc);
  }

  handleTypeChange(event: string) {
    const oldHeading = this.heading;
    const oldValue = this.selectedNode.tocItemType;
    this.tocType = event;

    //save snapshot of old tree
    this.handleNodeChanges(this.toc, true);

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
          'toc.item.type.' +
            this.selectedNode.tocItemType.toLowerCase() +
            '.article.heading',
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
    this.handleNodeChanges(this.toc);
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
      [POINT, INDENT].includes(n.tocItem.aknTag),
    );
    if (childItems && childItems.length > 0) {
      childLists = [...childItems];
    } else {
      for (const child of item.childItems) {
        if (child.tocItem.aknTag === LIST) {
          const filtered = item.childItems.filter((n) =>
            [POINT, INDENT].includes(n.tocItem.aknTag),
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
    if (tocItem.aknTag === CROSSHEADING) {
      return this.translateService.instant('toc.item.type.crossheading');
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
      (n) => n.tocItem.aknTag === DIVISION,
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

  private containsXmlTags(content: string) {
    return content.includes(OPEN_TAG) || content.includes(CLOSE_TAG);
  }
}
