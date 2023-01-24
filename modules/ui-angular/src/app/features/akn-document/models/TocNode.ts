import { TableOfContentItemVO } from './toc.model';

export interface TocNode extends TableOfContentItemVO {
  children: TocNode[];
}
