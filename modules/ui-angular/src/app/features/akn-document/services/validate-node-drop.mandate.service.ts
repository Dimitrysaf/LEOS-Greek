import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  BULLET_NUM,
  INDENT,
  LEVEL,
  LIST,
  MAX_INDENT_LEVEL,
  PARAGRAPH,
  POINT,
  SUBPARAGRAPH,
} from '@/shared/constants';
import { NodeValidation } from '@/shared/models/drop-response.model';
import { TableOfContentItemVO } from '@/shared/models/toc.model';
import { DocumentService } from '@/shared/services/document.service';
import {
  containsItem,
  containsOnlySameIndentType,
  getIndentLevel, getNumberingTypeByLanguage,
  isIndentAllowed,
  isNumSoftDeleted,
  validateAgainstOtherIndentsInList,
} from '@/shared/utils/toc.utils';

import { ValidateTocService } from './validate-node-drop.service';

@Injectable()
export class ValidateTocMandateService extends ValidateTocService {
  constructor(
    protected _http: HttpClient,
    protected documentService: DocumentService,
  ) {
    super(_http, documentService);
  }

  validateAddingToItem(
    validationResult: NodeValidation,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    actualTargetItem: TableOfContentItemVO,
    position: string,
  ) {
    if (!actualTargetItem) {
      actualTargetItem = targetItem;
    }
    const droppedElementTagName = sourceItem.tocItem.aknTag;
    const droppedElementTagNumberingType = getNumberingTypeByLanguage(sourceItem.tocItem, this.documentConfig.langGroup);

    const targetName = actualTargetItem.tocItem.aknTag;
    let indentAllowed = false;

    switch (droppedElementTagName) {
      case SUBPARAGRAPH: {
        if (!this.isNumbered(actualTargetItem)) {
          validationResult.success = true;
          validationResult.messageKey =
            'toc.edit.window.drop.error.subparagraph.message';
          return false;
        }
        break;
      }
      case POINT:
      case INDENT: {
        indentAllowed = isIndentAllowed(
          tocTree,
          actualTargetItem,
          MAX_INDENT_LEVEL - getIndentLevel(sourceItem),
        );
        if (
          !indentAllowed ||
          ![PARAGRAPH, LEVEL, LIST, POINT, INDENT].includes(targetName) ||
          ([PARAGRAPH, LEVEL].includes(targetName) &&
            containsItem(actualTargetItem, droppedElementTagName) &&
            droppedElementTagName !== POINT &&
            ![INDENT, BULLET_NUM].includes(droppedElementTagNumberingType)) ||
          ([PARAGRAPH, LEVEL].includes(targetName) &&
            (containsItem(actualTargetItem, LIST) ||
              !containsOnlySameIndentType(
                actualTargetItem,
                droppedElementTagNumberingType,
                this.documentConfig.langGroup
              ))) ||
          (targetName === droppedElementTagName &&
            containsItem(actualTargetItem, LIST)) ||
          !validateAgainstOtherIndentsInList(tocTree, sourceItem, targetItem, this.documentConfig.langGroup)
        ) {
          validationResult.success = false;
          if (!indentAllowed) {
            validationResult.messageKey =
              'toc.edit.window.drop.error.indentation.message';
            console.log('toc.edit.window.drop.error.indentation.message');
            // result.setMessageKey("toc.edit.window.drop.error.indentation.message");
          } else if (containsItem(actualTargetItem, LIST)) {
            validationResult.messageKey =
              'toc.edit.window.drop.already.contains.list.error.message';
          } else {
            validationResult.messageKey = 'toc.edit.window.drop.error.message';
          }
          return false;
        }
        break;
      }
      case LIST: {
        indentAllowed = isIndentAllowed(
          tocTree,
          actualTargetItem,
          MAX_INDENT_LEVEL - getIndentLevel(sourceItem),
        );
        if (
          !indentAllowed ||
          ((targetName === PARAGRAPH || targetName === LEVEL) &&
            containsItem(actualTargetItem, LIST)) ||
          ((targetName === POINT || targetName === INDENT) &&
            containsItem(actualTargetItem, LIST))
        ) {
          validationResult.success = false;
          validationResult.messageKey = !indentAllowed
            ? 'toc.edit.window.drop.error.indentation.message'
            : 'toc.edit.window.drop.error.list.message';
          return false;
        }
        break;
      }
      default:
        break;
    }
    return true;
  }

  private isNumbered = (element: TableOfContentItemVO) => {
    let _isNumbered = true;
    if (element.tocItem.itemNumber === 'NONE') {
      _isNumbered = false;
    } else if (
      element.tocItem.itemNumber === 'OPTIONAL' &&
      (!element.number ||
        element.number === '' ||
        isNumSoftDeleted(element.numSoftActionAttr))
    ) {
      _isNumbered = false;
    }
    return _isNumbered;
  };
}
