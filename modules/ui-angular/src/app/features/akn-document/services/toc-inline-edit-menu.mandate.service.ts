import { Injectable } from '@angular/core';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { EuiDropdownButtonMenuItem } from '@eui/components/eui-dropdown-button-menu';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import {
  ARTICLE_TYPE_CHANGE_ACTION_ID,
  ARTICLE_TYPE_DEFINITION,
  ARTICLE_TYPE_REGULAR,
  CROSSHEADING_CHANGE_TYPE_ACTION_ID,
  CROSSHEADING_CHANGE_TYPE_BULLET_NUM_ID,
  CROSSHEADING_CHANGE_TYPE_INDENT_ID,
  CROSSHEADING_CHANGE_TYPE_NO_GRAPHIC_ID,
  DIVISION_CHANGE_TYPE_1_ID,
  DIVISION_CHANGE_TYPE_2_ID,
  DIVISION_CHANGE_TYPE_3_ID,
  DIVISION_CHANGE_TYPE_4_ID,
  DIVISION_CHANGE_TYPE_ACTION_ID,
  INDENT_CHANGE_TYPE_ACTION_ID,
  INDENT_CHANGE_TYPE_LONG_INDENT_ID,
  INDENT_CHANGE_TYPE_NO_GRAPHIC_ID,
  INDENT_CHANGE_TYPE_NUMBERED_ID,
  POINT_CHANGE_TYPE_ACTION_ID,
  POINT_CHANGE_TYPE_LONG_INDENT_ID,
  POINT_CHANGE_TYPE_NO_GRAPHIC_ID,
  POINT_CHANGE_TYPE_NUMBERED_ID,
} from '@/features/akn-document/constants/inline-toc-actions.constants';
import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';
import { TableOfContentEditService } from '@/features/akn-document/services/table-of-content-edit.service';
import { ValidateTocService } from '@/features/akn-document/services/validate-node-drop.service';
import {DocumentConfig, NumberingConfig, NumberingType} from '@/shared';
import {
  ARTICLE,
  BLOCK,
  CROSSHEADING,
  DIVISION,
  HASH_NUM_VALUE,
  INDENT,
  LIST,
  POINT,
} from '@/shared/constants';
import { TableOfContentItemVO, TocItem } from '@/shared/models/toc.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';
import {
  findNodeById,
  getItemIndentLevel,
  getNumberingConfig, getNumberingTypeByLanguage,
  getTocItemByNumberingType,
  updateDepthOfTocItems,
} from '@/shared/utils/toc.utils';

import { TocInlineEditMenuService } from './toc-inline-edit-menu.service';

@Injectable()
export class TocInlineEditMenuMandateService extends TocInlineEditMenuService {
  private active_division_style = 'style_1';
  private possibleDivisionType: any[];
  private active_point_style = '';
  private active_block_style = '';
  private active_paragraph_style = '';

  constructor(
    protected store: Store<any>,
    protected dialogService: EuiDialogService,
    protected tocEditService: TableOfContentEditService,
    protected coEditionService: CoEditionServiceWS,
    protected translateService: TranslateService,
    protected tocService: TableOfContentService,
    protected documentService: DocumentService,
    protected validateNodeService: ValidateTocService,
  ) {
    super(
      store,
      dialogService,
      validateNodeService,
      tocEditService,
      coEditionService,
      translateService,
      tocService,
      documentService,
    );
  }

  protected buildTypeSpecificItems(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem[] {
    const items: EuiDropdownButtonMenuItem[] = [];
    switch (node.tocItem.aknTag) {
      case CROSSHEADING:
        items.push(this.buildCrossHeadingItem(node));
        break;
      case BLOCK:
        break;
      case DIVISION:
        items.push(this.buildDivisionItem(node));
        break;
      case POINT:
        items.push(this.buildPointItem(node));
        break;
      case INDENT:
        items.push(this.buildIndentItem(node));
        break;
      case ARTICLE:
        items.push(this.buildArticleItem(node));
        break;
    }
    return items;
  }

  private buildCrossHeadingItem(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem {
    return {
      id: CROSSHEADING_CHANGE_TYPE_ACTION_ID,
      label: this.translateService.instant(
        'toc.edit.window.item.list.type.change',
      ),
      children: [
        {
          id: CROSSHEADING_CHANGE_TYPE_NO_GRAPHIC_ID,
          label: this.translateService.instant(
            'toc.edit.window.item.list.type.none',
          ),
          command: () => this.handleListRadioButton('NONE'),
        },
        {
          id: CROSSHEADING_CHANGE_TYPE_BULLET_NUM_ID,
          label: this.translateService.instant(
            'toc.edit.window.item.list.type.bullet_num',
          ),
          command: () => this.handleListRadioButton('BULLET_BLACK_CIRCLE'),
        },
        {
          id: CROSSHEADING_CHANGE_TYPE_INDENT_ID,
          label: this.translateService.instant(
            'toc.edit.window.item.list.type.indent',
          ),
          command: () => this.handleListRadioButton('INDENT'),
        },
      ],
    };
  }

  private buildDivisionItem(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem {
    this.active_division_style = node.autoNumOverwritten ? null : node.style;
    this.possibleDivisionType = this.getDivisionTypesToEnable(
      this.getPreviousDivisionType(node),
    );
    return {
      id: DIVISION_CHANGE_TYPE_ACTION_ID,
      label: this.translateService.instant('toc.edit.window.item.list.type'),
      children: [
        {
          id: DIVISION_CHANGE_TYPE_1_ID,
          label: this.translateService.instant(
            'toc.division.number.caption.type_1',
          ),
          command: () => this.handleDivisionChange('type_1'),
          disabled: !this.isDivisionStyleEnabled('type_1'),
        },
        {
          id: DIVISION_CHANGE_TYPE_2_ID,
          label: this.translateService.instant(
            'toc.division.number.caption.type_2',
          ),
          command: () => this.handleDivisionChange('type_2'),
          disabled: !this.isDivisionStyleEnabled('type_2'),
        },
        {
          id: DIVISION_CHANGE_TYPE_3_ID,
          label: this.translateService.instant(
            'toc.division.number.caption.type_3',
          ),
          command: () => this.handleDivisionChange('type_3'),
          disabled: !this.isDivisionStyleEnabled('type_3'),
        },
        {
          id: DIVISION_CHANGE_TYPE_4_ID,
          label: this.translateService.instant(
            'toc.division.number.caption.type_4',
          ),
          command: () => this.handleDivisionChange('type_4'),
          disabled: !this.isDivisionStyleEnabled('type_4'),
        },
      ],
    };
  }

  private buildPointItem(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem {
    return {
      id: POINT_CHANGE_TYPE_ACTION_ID,
      label: this.translateService.instant(
        'toc.edit.window.item.list.type.change',
      ),
      children: [
        {
          id: POINT_CHANGE_TYPE_NO_GRAPHIC_ID,
          label: this.translateService.instant('toc.item.type.bullet'),
          command: () =>
            this.handleIndentListRadioButtonGroupChange('BULLET_NUM'),
        },
        {
          id: POINT_CHANGE_TYPE_LONG_INDENT_ID,
          label: this.translateService.instant('toc.item.type.indent'),
          command: () => this.handleIndentListRadioButtonGroupChange('INDENT'),
        },
        {
          id: POINT_CHANGE_TYPE_NUMBERED_ID,
          label: this.translateService.instant(
            'toc.edit.window.item.list.type.numbered',
          ),
          command: () =>
            this.handleIndentListRadioButtonGroupChange('POINT_NUM'),
        },
      ],
    };
  }

  private buildIndentItem(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem {
    return {
      id: INDENT_CHANGE_TYPE_ACTION_ID,
      label: this.translateService.instant(
        'toc.edit.window.item.list.type.change',
      ),
      children: [
        {
          id: INDENT_CHANGE_TYPE_NO_GRAPHIC_ID,
          label: this.translateService.instant('toc.item.type.bullet'),
          command: () =>
            this.handleIndentListRadioButtonGroupChange('BULLET_NUM'),
        },
        {
          id: INDENT_CHANGE_TYPE_LONG_INDENT_ID,
          label: this.translateService.instant('toc.item.type.indent'),
          command: () => this.handleIndentListRadioButtonGroupChange('INDENT'),
        },
        {
          id: INDENT_CHANGE_TYPE_NUMBERED_ID,
          label: this.translateService.instant(
            'toc.edit.window.item.list.type.numbered',
          ),
          command: () =>
            this.handleIndentListRadioButtonGroupChange('POINT_NUM'),
        },
      ],
    };
  }

  private handleListRadioButton(value: NumberingType) {
    const selectedNode = this.getTargetNode();
    const toc = this.tocService.getCurrentToc();
    const tocItems = this.tocService.getCurrentTocItems();
    const oldValue = getNumberingTypeByLanguage(selectedNode.tocItem, this.documentConfig.langGroup);
    this.active_block_style = value;
    //save snapshot of old tree
    this.tocEditService.handleNodeChanges(toc, true);
    const numberConfig = getNumberingConfig(
      this.documentConfig.numberingConfig,
      value,
    );
    const newTocItem = getTocItemByNumberingType(
      tocItems,
      value,
      selectedNode.tocItem.aknTag,
      this.documentConfig.langGroup
    );
    selectedNode.tocItem = newTocItem;
    selectedNode.number = numberConfig.sequence;
    this.tocEditService.handleNodeChanges(toc);
  }

  private handleDivisionChange(value: string) {
    const toc = this.tocService.getCurrentToc();
    const selectedNode = this.getTargetNode();
    //save snapshot of old tree
    this.tocEditService.handleNodeChanges(toc, true);
    selectedNode.style = value;
    this.active_division_style = value;
    selectedNode.autoNumOverwritten = false;
    updateDepthOfTocItems(selectedNode.childItems);
    selectedNode.number = HASH_NUM_VALUE;
    this.tocEditService.handleNodeChanges(toc);
  }

  private handleIndentListRadioButtonGroupChange(value) {
    const selectedNode = this.getTargetNode();
    const tocItems = this.tocService.getCurrentTocItems();
    const toc = this.tocService.getCurrentToc();
    const oldValue = getNumberingTypeByLanguage(selectedNode.tocItem, this.documentConfig.langGroup);
    this.active_point_style = value;

    //save snapshot of old tree
    this.tocEditService.handleNodeChanges(toc, true);
    const newTocItem = getTocItemByNumberingType(tocItems, value, INDENT, this.documentConfig.langGroup);
    const parentNode = findNodeById(toc, selectedNode.parentItem);
    this.propagateListType(
      toc,
      this.findRootList(toc, selectedNode),
      newTocItem,
    );
    this.tocEditService.handleNodeChanges(toc);
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

  private getNewNumberingFromListTocItem(
    list: TableOfContentItemVO[],
    tocItem: TocItem,
    numberingConfigs: NumberingConfig[],
  ) {
    const toc = this.tocService.getCurrentToc();
    let sequence = '#';
    let numType = getNumberingTypeByLanguage(tocItem, this.documentConfig.langGroup);
    const config = getNumberingConfig(numberingConfigs, numType);
    if (list && list.length > 0 && config && !config.numbered) {
      const firstChild = list.at(0);
      if (config && (!config.levels || config.levels.levels.length === 0)) {
        sequence = config.prefix + config.sequence + config.suffix;
      } else if (config && config.levels && config.levels.levels.length > 0) {
        const level = 0;
        getItemIndentLevel(
          toc,
          findNodeById(toc, firstChild.parentItem),
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

  private getPreviousDivisionType(node: TableOfContentItemVO) {
    const toc = this.tocService.getCurrentToc();
    const parentNode = findNodeById(toc, node.parentItem);
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

  private isDivisionStyleEnabled(target: string) {
    return this.possibleDivisionType.indexOf(target) !== -1;
  }
}
