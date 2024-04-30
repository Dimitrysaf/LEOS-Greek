import { TocItem } from '../models/toc.model';
import { getNumberingTypeByLanguage } from '@/shared/utils/toc.utils';

export const getIdentifier = (aknTag: string, numberingType: string) =>
  [aknTag.toUpperCase(), numberingType.toUpperCase()].join('_');

export const isTocItemsEqual = (tocItem1: TocItem, tocItem2: TocItem, langGroup: string) =>
  tocItem1.aknTag === tocItem2.aknTag && getNumberingTypeByLanguage(tocItem1, langGroup) === getNumberingTypeByLanguage(tocItem2, langGroup);

