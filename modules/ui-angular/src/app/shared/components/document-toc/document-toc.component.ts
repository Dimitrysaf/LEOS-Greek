import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragMove,
  CdkDragStart,
} from '@angular/cdk/drag-drop';
import { NestedTreeControl } from '@angular/cdk/tree';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { UxAppShellService } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep, truncate } from 'lodash-es';
import { Subject, takeUntil } from 'rxjs';

import {
  DocumentConfig,
  NumberingConfig,
  NumberingType,
} from '@/shared/models';
import { DragAction } from '@/shared/models/drag-action.model';
import { NodeValidationResponse } from '@/shared/models/drop-response.model';
import { DocumentService } from '@/shared/services/document.service';
import { capitalizeFirstLetter } from '@/shared/utils/string.utils';
import {
  checkPositionAfterValidation,
  checkPositionAfterValidationExplanatory,
  convertArticle,
  getItemIndentLevel,
  getNumberingConfig,
  getTocItemByNumberingConfig,
  getTocItemByNumberingType,
} from '@/shared/utils/toc.utils';

import { TableOfContentItemVO, TocItem } from '../../models/toc.model';

const MAX_LABEL_TREE_LENGTH = 50;

const NUMBERED = 'Numbered';
const UNNUMBERED = 'Unnumbered';
const INDENT = 'INDENT';
const POINT = 'POINT';
const LIST = 'LIST';
const BULLET_NUM = 'BULLET_NUM';
const MAIN_BODY = 'MAIN_BODY';
@Component({
  selector: 'app-document-toc',
  templateUrl: './document-toc.component.html',
  styleUrls: ['./document-toc.component.scss'],
})
export class DocumentTocComponent implements OnInit, OnDestroy {
  @Input() isEdit: boolean;
  @Input() documentType: string;
  @Input() documentRef: string;
  @Input() tocItems: TocItem[];
  @Output() reBuildTocItems: EventEmitter<boolean> = new EventEmitter();
  annexRef: string;

  documentConfig: DocumentConfig;

  //toc related
  toc: TableOfContentItemVO[];
  selectedNode: TableOfContentItemVO = null;
  selectedNodeToMove: TableOfContentItemVO = null;
  isToCDraft: boolean;
  messageFromValidation: string;
  isDropValid: boolean;

  //division related
  active_division_style = 'style_1';
  active_point_style = '';
  active_block_style = '';
  active_paragraph_style = '';
  dragAction: DragAction;

  //article type
  previousHeading: string;
  previousType: string;
  restored: boolean;

  //environment var
  environment = process.env.NG_APP_LEOS_INSTANCE;

  //ng values for the selected node edit
  preiviousHeading: string = null;
  heading: string;
  number: string;
  type: string;
  tocType: string;
  possibleDivisionType: any[];
  treeHistory: Array<TableOfContentItemVO[]> = [];

  treeControl: NestedTreeControl<TableOfContentItemVO>;
  levels = new Map<TableOfContentItemVO, number>();
  dataSource: MatTreeNestedDataSource<TableOfContentItemVO>;
  expandedNodes: TableOfContentItemVO[] = [];

  destroy$: Subject<any> = new Subject();
  constructor(
    private documentService: DocumentService,
    private uxAppShellService: UxAppShellService,
    private dialogService: EuiDialogService,
    public tranlsateService: TranslateService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.documentService.tocItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((toc) => {
        // this.saveExpanded();
        this.setTree(toc ?? []);
      });

    this.documentService.documentConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe((dConfig) => (this.documentConfig = dConfig));
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit() {
    this.documentService.setDocumentCategory(this.documentType.toLowerCase());
    if (this.documentRef) {
      this.documentService
        .getToc(this.documentRef)
        .pipe(takeUntil(this.destroy$))
        .subscribe((toc) => this.setTree(toc));
    }
  }

  getChildren = (node: TableOfContentItemVO) => node.childItems;

  hasChildren = (index: number, node: TableOfContentItemVO) =>
    node.childItems.length > 0;

  getLabel(node: TableOfContentItemVO) {
    switch (node.tocItem.aknTag) {
      case 'CITATIONS':
      case 'PREAMBLE':
      case 'RECITALS':
      case 'BODY':
      case 'PREFACE':
        return capitalizeFirstLetter(node.tocItem.aknTag);
      case 'MAIN_BODY':
        return 'Body';
      case 'CONCLUSIONS':
        return 'Signature';
      case 'ARTICLE':
        return `Article ${node.number} - ${node.heading}`;
      default:
        return truncate(
          [node.number, node.heading || node.content].filter(Boolean).join(' '),
          { length: MAX_LABEL_TREE_LENGTH },
        );
    }
  }

  isEditMode() {
    return this.isEdit;
  }

  handleHeadingChange(value) {
    this.preiviousHeading = this.heading;
    this.selectedNode.heading = value;
  }

  handlePlaceAt(nodeTarget: TableOfContentItemVO, position: string) {
    const nodeTargetParent = this.findNodeById(
      this.treeControl.dataNodes,
      nodeTarget.parentItem,
    );
    this.validateAndMove(
      this.selectedNodeToMove,
      nodeTarget,
      nodeTargetParent,
      position,
    );
  }

  handleMove(node: TableOfContentItemVO) {
    this.hanldeNodeSelect(node);
    this.selectedNodeToMove = node;
  }

  isNodeSelected() {
    return this.selectedNode !== null;
  }

  isNodeSelectedToMove() {
    return this.selectedNodeToMove !== null;
  }

  saveExpanded(node: TableOfContentItemVO) {
    if (this.expandedNodes.some((n) => n.id === node.id)) {
      this.expandedNodes.filter((n) => n.id !== node.id);
      return;
    }
    this.expandedNodes.push(node);
  }

  expandAll() {
    this.treeControl.expandAll();
  }

  colllapseAll() {
    this.treeControl.collapseAll();
  }

  hanldeTocRemove() {
    const newTree = cloneDeep(this.treeControl.dataNodes);
    //TODO : handle if a node can remove or not show message
    if (this.selectedNodeToMove && this.selectedNodeToMove.tocItem.deletable) {
      this.removeNode(newTree, this.selectedNodeToMove);
      this.treeHistory.push(this.treeControl.dataNodes);
      this.documentService.setToc(newTree);
      this.selectedNodeToMove = null;
    }
    if (this.selectedNode && this.selectedNode.tocItem.deletable) {
      this.removeNode(newTree, this.selectedNode);
      this.treeHistory.push(this.treeControl.dataNodes);
      this.documentService.setToc(newTree);
      this.selectedNode = null;
    }
  }

  hanldeNodeSelect(node: TableOfContentItemVO) {
    this.selectedNode = node;
    this.scrollToElement(node);
    this.hilightSelectedNode(node);
    this.heading = node.heading;
    this.type = this.getDisplayableTocItem(node.tocItem);
    this.number = node.number;
    this.tocType = node.tocItemType?.toLowerCase();
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
        node.childItems && node.childItems.at(0).number?.length > 0
          ? NUMBERED
          : UNNUMBERED ?? UNNUMBERED;
    }
  }

  getNumberToggleValue(item: TableOfContentItemVO) {
    let toggleValue;
    console.log(item);
    const firstChild = item.childItems.at(0);
    if (firstChild.number?.length > 0 && item.numSoftActionAttr !== 'DELETE') {
      toggleValue = NUMBERED;
    }
    toggleValue = UNNUMBERED;
    return toggleValue;
  }

  getPreviousDivisionType(node: TableOfContentItemVO) {
    const parentNode = this.findNodeById(this.toc, node.parentItem);
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

  onDragStart(event: CdkDragStart) {
    console.log(event);
  }
  onEnter(event: CdkDragEnter) {
    console.log(event);
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

  isItemNumberEditable(tocItem: TocItem) {
    return tocItem.numberEditable;
  }

  isItemNumberVisible(tocItem: TocItem) {
    return (
      tocItem.itemNumber === 'MANDATORY' || tocItem.itemNumber === 'OPTIONAL'
    );
  }

  handleParagraphToggle(event) {
    const { value } = event.target;
    if (
      this.selectedNode.childItems &&
      this.selectedNode.childItems.length > 0
    ) {
      const newTree = cloneDeep(this.toc);
      const newSelectedNode = this.findNodeById(newTree, this.selectedNode.id);
      //no  need to check if children exists the flow requires it
      const firstChild = newSelectedNode.childItems.at(0);
      let flag = false;
      for (const itemVo of newSelectedNode.childItems) {
        if (itemVo.numSoftActionAttr && itemVo.numSoftActionAttr !== 'DELETE') {
          flag = true;
          break;
        }
      }
      if (value === NUMBERED) {
        if (
          !firstChild.number ||
          (firstChild.number && firstChild.number === '') ||
          flag
        ) {
          newSelectedNode.numberingToggled = true;
          for (const n of newSelectedNode.childItems) {
            n.number = '#';
          }
          this.treeHistory.push(this.treeControl.dataNodes);
          this.setTree(newTree);
        }
      } else if (value === UNNUMBERED) {
        if (firstChild.number && firstChild.number.length > 0 && !flag) {
          newSelectedNode.numberingToggled = false;
          for (const n of newSelectedNode.childItems) {
            n.number = null;
          }
          this.treeHistory.push(this.treeControl.dataNodes);
          this.setTree(newTree);
        }
      }
    }
  }

  handleListRadioButton(event) {
    const { value } = event.target;
    const oldValue = this.selectedNode.tocItem.numberingType;
    this.active_block_style = value;

    const newTree = cloneDeep(this.toc);
    const newSelectedNode = this.findNodeById(newTree, this.selectedNode.id);
    const numberConfig = getNumberingConfig(
      this.documentConfig.numberingConfig,
      value,
    );
    const newTocItem = getTocItemByNumberingType(
      this.tocItems,
      value,
      newSelectedNode.tocItem.aknTag,
    );
    newSelectedNode.tocItem = newTocItem;
    newSelectedNode.number = numberConfig.sequence;
    this.treeHistory.push(this.treeControl.dataNodes);
    this.setTree(newTree);
  }

  handleIndentListRadioButtonGroupChange(event) {
    const { value } = event.target;
    const oldValue = this.selectedNode.tocItem.numberingType;
    this.active_point_style = value;
    const newTocItem = getTocItemByNumberingType(this.tocItems, value, INDENT);
    const newTree = cloneDeep(this.toc);
    const newSelectedNode = this.findNodeById(newTree, this.selectedNode.id);
    const parentNode = this.findNodeById(newTree, this.selectedNode.parentItem);
    this.propagateListType(
      newTree,
      this.findRootList(newTree, newSelectedNode),
      newTocItem,
    );
    this.treeHistory.push(this.treeControl.dataNodes);
    this.setTree(newTree);
    setTimeout(() => {
      this.hanldeNodeSelect(newSelectedNode);
    });
  }

  propagateListType(
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

  handleDivisionChange(event: any) {
    const newTree = cloneDeep(this.toc);
    const selectedNodeInNewTree = this.findNodeById(
      newTree,
      this.selectedNode.id,
    );
    const { value } = event.target;
    selectedNodeInNewTree.style = value;
    this.active_division_style = value;
    this.treeHistory.push(this.treeControl.dataNodes);
    this.setTree(newTree);
    setTimeout(() => {
      this.hilightSelectedNode(selectedNodeInNewTree);
    });
  }

  handleListRadioButtonGroupChange(event: string) {
    const numberingConfig = getNumberingConfig(
      this.documentConfig.numberingConfig,
      event as NumberingType,
    );
    this.selectedNode.tocItem = getTocItemByNumberingType(
      this.tocItems,
      event as NumberingType,
      this.selectedNode.tocItem.aknTag,
    );
    this.selectedNode.number = numberingConfig.sequence;
  }

  handleTypeChange(event: string) {
    const oldHeading = this.heading;
    const oldValue = this.selectedNode.tocItemType;
    this.tocType = event;
    const newTree = cloneDeep(this.treeControl.dataNodes);
    const newSelectedNode = this.findNodeById(newTree, this.selectedNode.id);
    newSelectedNode.tocItemType = event.toUpperCase();

    convertArticle(
      this.tocItems,
      newSelectedNode,
      oldValue.toUpperCase(),
      event.toUpperCase(),
    );

    if (
      this.previousType &&
      this.previousType.toLowerCase() === event.toLowerCase()
    ) {
      newSelectedNode.isAffected = false;
      if (oldHeading !== '') {
        this.heading = this.preiviousHeading;
        newSelectedNode.heading = this.heading;
      } else {
        this.heading = this.tranlsateService.instant(
          'toc.item.type.' + newSelectedNode.tocItemType + '.article.heading',
        );
        newSelectedNode.heading = this.heading;
      }
    } else {
      newSelectedNode.isAffected = false;
      this.heading = this.tranlsateService.instant(
        'toc.item.type.' +
          newSelectedNode.tocItemType.toLowerCase() +
          '.article.heading',
      );
      newSelectedNode.heading = this.heading;
    }

    //save the old value
    this.previousType = oldValue;
    this.preiviousHeading = oldHeading;
    this.treeHistory.push(this.treeControl.dataNodes);
    this.setTree(newTree);
    this.hanldeNodeSelect(newSelectedNode);
  }

  //a node can be dropped from two sources
  //1) the ToC itself
  //2) the drag elements found on the left
  onDrop(event: CdkDragDrop<TableOfContentItemVO>) {
    if (this.dragAction.targetId === null) {
      this.cancelDrop();
      return;
    }

    const nodeTarget = this.findNodeById(
      this.treeControl.dataNodes,
      this.dragAction.targetId,
    );

    const nodeDragged = event.item.data as TableOfContentItemVO;
    //TODO : Fix this => this is a hack for allowing the root to go for validation otherwise it will fail to find the nodeParent and will not send it for validaiton
    if (nodeTarget.tocItem.root) {
      nodeTarget.parentItem = nodeTarget.id;
    }

    const parentNode = this.findNodeById(
      this.treeControl.dataNodes,
      nodeTarget.parentItem,
    );

    // validate Drop
    this.validateAndMove(
      nodeDragged,
      nodeTarget,
      parentNode,
      this.dragAction.action,
      this.dragAction.isAdd,
    );
  }

  dragMoved(event: CdkDragMove, isAdd: boolean = false) {
    this.clearDragInfo();

    let el = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y,
    );

    el = this.getToMatNodeFromChild(el);
    if (el) {
      const targetId = el.getAttribute('data-id');
      const level = parseInt(el.getAttribute('aria-level'), 10);

      if (!el || !level) {
        this.dragAction = null;
        return;
      }
      const targetRect = el.getBoundingClientRect();
      const oneThird = targetRect.height / 3;
      if (event.pointerPosition.y - targetRect.top < oneThird) {
        this.dragAction = {
          action: 'BEFORE',
          targetId,
          level,
          isAdd,
        };
      } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
        this.dragAction = {
          action: 'AFTER',
          targetId,
          level,
          isAdd,
        };
      } else {
        this.dragAction = {
          action: 'AS_CHILDREN',
          targetId,
          level,
          isAdd,
        };
      }
      this.showNodeInsertion();
    }
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
          this.findNodeById(this.toc, firstChild.parentItem),
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
    let parentItem = this.findNodeById(root, item.parentItem);
    while (
      parentItem &&
      (parentItem.tocItem.aknTag === LIST ||
        parentItem.tocItem.aknTag === POINT ||
        parentItem.tocItem.aknTag === INDENT)
    ) {
      tmpItem = parentItem;
      parentItem = this.findNodeById(root, parentItem.parentItem);
    }
    if (tmpItem.tocItem.aknTag !== LIST)
      tmpItem = this.findNodeById(root, tmpItem.parentItem);
    return tmpItem.childItems.filter((n) =>
      [POINT, INDENT].includes(n.tocItem.aknTag),
    );
  }

  private validateAndMove(
    nodeDragged: TableOfContentItemVO,
    nodeTarget: TableOfContentItemVO,
    parentNode: any,
    position: string,
    isAdd: boolean = false,
  ) {
    this.documentService
      .validateNodeDrop(
        [nodeDragged.id],
        nodeDragged.tocItem.aknTag,
        nodeTarget.id,
        nodeTarget.tocItem.aknTag,
        parentNode.id,
        parentNode.tocItem.aknTag,
        position,
        this.documentType,
        this.documentRef,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.populateValidationMessage(response);
          setTimeout(() => {
            this.clearValidationMessage();
          }, 10000);
          if (response.result.success) {
            // same type nodes will validate to response.success since in the validation processs , it will validates if it can drop as sibling and not as children
            // so the resutl.success will now mean that it can be dropped as a sibling
            if (position === 'AS_CHILDREN') {
              console.log(this.documentType);
              switch (this.documentType) {
                case 'council_explanatory':
                  position = checkPositionAfterValidationExplanatory(
                    nodeTarget,
                    nodeDragged,
                    position,
                  );
                  break;
                default:
                  position = checkPositionAfterValidation(
                    nodeTarget,
                    nodeDragged,
                    position,
                  );
              }
            }
            try {
              switch (position) {
                case 'AFTER':
                  this.insertAfter(nodeTarget, nodeDragged, isAdd);
                  break;
                case 'BEFORE':
                  this.insertBefore(nodeTarget, nodeDragged, isAdd);
                  break;
                case 'AS_CHILDREN':
                  this.insertChild(nodeTarget, nodeDragged, isAdd);
                  break;
              }
              //if source was the tocitems rebuild to change the uuid
              if (isAdd) {
                // this.dragItems = this.tocItemToTOC(this.tocItems);
                this.reBuildTocItems.emit(true);
              }
              this.isToCDraft = true;
              this.hanldeNodeSelect(nodeDragged);
              this.selectedNodeToMove = null;
            } catch (e) {
              this.clearDragInfo(true);
              return;
            }
          } else {
            this.clearDragInfo(false);
          }
        },
        error: (err) => {
          console.error(err);
          this.clearDragInfo(true);
        },
      });
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

  private populateValidationMessage(response: NodeValidationResponse) {
    this.isDropValid = response.result.success;
    this.messageFromValidation = response.result.messageKey;
  }

  private clearValidationMessage() {
    this.isDropValid = null;
    this.messageFromValidation = null;
  }

  private getDisplayableTocItem(tocItem: TocItem): string {
    if (tocItem.numberingType === BULLET_NUM) {
      return this.tranlsateService.instant('toc.item.type.bullet');
    }
    if (tocItem.aknTag === MAIN_BODY) {
      return this.tranlsateService.instant('toc.item.type.mainbody');
    }
    return this.tranlsateService.instant(
      'toc.item.type.' + tocItem.aknTag.toLowerCase(),
    );
  }

  private hilightSelectedNode(node: TableOfContentItemVO) {
    this.document
      .querySelectorAll('.selected-node')
      .forEach((el) => el.classList.remove('selected-node'));
    const element = document.querySelector(`[data-id="${node.id}"]`);
    element.classList.add('selected-node');
  }

  private getToMatNodeFromChild(el: Element) {
    if (el.classList.contains('mat-nested-tree-node')) return el;
    if (el.parentElement) {
      const parentEl = this.getToMatNodeFromChild(el.parentElement);
      if (parentEl) return parentEl;
    }
  }

  private cancelDrop() {
    this.restoreExpanded();
    this.clearDragInfo();
  }

  private showNodeInsertion(invalid = false) {
    if (!this.dragAction) {
      return;
    }
    const node = this.document.querySelector(
      `[data-id="${this.dragAction.targetId}"]`,
    );
    // wrap the label not the tree
    const labelContainer = node;
    labelContainer.classList.add(
      `drop-${this.dragAction.action.toLocaleLowerCase()}`,
    );
    if (invalid) {
      labelContainer.classList.add(
        `drop-${this.dragAction.action.toLocaleLowerCase()}-invalid`,
      );
    }
    setTimeout(() => {
      this.clearInvalidDrop();
    }, 3000);
  }

  private clearDragInfo(dropped = false) {
    if (dropped) {
      this.dragAction = null;
    }
    this.selectedNode = null;
    this.document
      .querySelectorAll('.drop-before')
      .forEach((element) => element.classList.remove('drop-before'));
    this.document
      .querySelectorAll('.drop-after')
      .forEach((element) => element.classList.remove('drop-after'));
    this.document
      .querySelectorAll('.drop-as_children')
      .forEach((element) => element.classList.remove('drop-as_children'));
  }

  private clearInvalidDrop() {
    this.document
      .querySelectorAll('.drop-before-invalid')
      .forEach((element) => element.classList.remove('drop-before-invalid'));
    this.document
      .querySelectorAll('.drop-after-invalid')
      .forEach((element) => element.classList.remove('drop-after-invalid'));
    this.document
      .querySelectorAll('.drop-as_children-invalid')
      .forEach((element) =>
        element.classList.remove('drop-as_children-invalid'),
      );
  }

  private scrollToElement(node: TableOfContentItemVO) {
    const targetElement = document.getElementById(node.id);
    if (targetElement) {
      targetElement.style.backgroundColor = 'cornsilk';
      setTimeout(() => {
        targetElement.style.background = '';
      }, 500);
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  private removeNode(
    root: TableOfContentItemVO[],
    target: TableOfContentItemVO,
  ) {
    const parentNode = this.findNodeById(root, target.parentItem);
    parentNode.childItems = parentNode.childItems.filter(
      (n) => target.id !== n.id,
    );
  }

  private insertAfter(
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    //clone the tree
    const newTree = cloneDeep(this.treeControl.dataNodes);
    if (isAdd) {
      this.addDefaultToNewItem(eventItem);
    }
    //remove the node from the tree
    if (!isAdd) this.removeNode(newTree, eventItem);
    //get parent of the node droped / to moved at
    const parentNode = this.findNodeById(newTree, target.parentItem);

    //set the selected / dragged  node to have the same id as the node droped/moved at
    eventItem.parentItem = parentNode.id;
    const targetIndex = parentNode.childItems.findIndex(
      (x) => x.id === target.id,
    );
    parentNode.childItems.splice(targetIndex + 1, 0, eventItem);
    //set the new tree
    this.treeHistory.push(this.treeControl.dataNodes);
    this.documentService.setToc(newTree);
  }

  private insertBefore(
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    //deep clone the tree
    const newTree = cloneDeep(this.treeControl.dataNodes);
    //remove the already existing node
    if (!isAdd) this.removeNode(newTree, eventItem);
    const parentNode = this.findNodeById(newTree, target.parentItem);
    const targetIndex = parentNode.childItems.findIndex(
      (x) => x.id === target.id,
    );
    //set the selected / dragged  node to have the same id as the node droped/moved at
    eventItem.parentItem = parentNode.id;

    if (targetIndex === 0) {
      parentNode.childItems.unshift(eventItem);
    } else {
      parentNode.childItems.splice(targetIndex, 0, eventItem);
    }
    this.treeHistory.push(this.treeControl.dataNodes);
    this.documentService.setToc(newTree);
  }

  private insertChild(
    target: TableOfContentItemVO,
    eventItem: TableOfContentItemVO,
    isAdd: boolean,
  ) {
    const newTree = cloneDeep(this.treeControl.dataNodes);
    if (!isAdd) this.removeNode(newTree, eventItem);
    //get node to insert to as child
    const parentToBeNode = this.findNodeById(newTree, target.id);
    if (!parentToBeNode.tocItem.childrenAllowed) {
      this.showNodeInsertion(true);
      return;
    }
    //set the selected / dragged  node to have the same id as the node droped/moved at
    eventItem.parentItem = parentToBeNode.id;
    parentToBeNode.childItems.push(eventItem);
    this.treeHistory.push(this.treeControl.dataNodes);
    this.documentService.setToc(newTree);
  }

  private restoreExpanded() {
    this.expandedNodes.forEach((node) => {
      this.treeControl.expand(
        this.treeControl.dataNodes.find((x) => x.id === node.id),
      );
    });
  }

  private findNodeById(
    root: TableOfContentItemVO[],
    id: string,
  ): TableOfContentItemVO | null {
    for (const node of root) {
      if (node.id === id) {
        return node;
      }
      if (node.childItems) {
        const found = this.findNodeById(node.childItems, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private setTree(toc: TableOfContentItemVO[]) {
    this.toc = toc;
    this.treeControl = new NestedTreeControl<TableOfContentItemVO>(
      this.getChildren,
    );
    this.dataSource = new MatTreeNestedDataSource();
    this.dataSource.data = toc;
    this.treeControl.dataNodes = this.dataSource.data;
    //expand the default nodes if the expanded state is empty
    if (toc && this.expandedNodes && this.expandedNodes.length === 0)
      for (const nodes of toc) this.defaultExpanded(nodes);
    else this.restoreExpanded();
  }

  private defaultExpanded(node: TableOfContentItemVO) {
    if (node.tocItem.expandedByDefault) this.treeControl.expand(node);
    if (node.childItems) {
      for (const n of node.childItems) this.defaultExpanded(n);
    }
  }

  private addDefaultToNewItem(eventItem: TableOfContentItemVO) {
    switch (eventItem.tocItem.aknTag) {
      case 'DIVISION': {
        eventItem.style = 'type_1';
        break;
      }
      case 'CROSS_HEADING': {
        eventItem.tocItem.numberingType = 'NONE';
        break;
      }
    }
  }
}
