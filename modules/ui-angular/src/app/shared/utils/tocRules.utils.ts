import { TocItem } from '../models/toc.model';

export const getIdentifier = (aknTag: string, numberingType: string) =>
  [aknTag.toUpperCase(), numberingType.toUpperCase()].join('_');

export const isTocItemsEqual = (tocItem1: TocItem, tocItem2: TocItem) =>
  tocItem1.aknTag === tocItem2.aknTag &&
  (tocItem1.numberingType === tocItem2.numberingType || tocItem1.alternateNumberingType === tocItem2.alternateNumberingType);
