import { Injectable } from '@angular/core';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';
import { TableOfContentEditService } from '@/features/akn-document/services/table-of-content-edit.service';
import { ValidateTocService } from '@/features/akn-document/services/validate-node-drop.service';
import { ARTICLE, CHAPTER, PART } from '@/shared/constants';
import { TableOfContentItemVO } from '@/shared/models/toc.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';

import { TocInlineEditMenuService } from './toc-inline-edit-menu.service';
import { DropdownModel } from '@/shared/dropdown.model';

@Injectable()
export class TocInlineEditMenuProposalService extends TocInlineEditMenuService {
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

  buildTypeSpecificItems(node: TableOfContentItemVO): DropdownModel[] {
    const items: DropdownModel[] = [];
    switch (node.tocItem.aknTag) {
      case ARTICLE:
        items.push(this.buildArticleItem(node));
        break;
      case CHAPTER:
        items.push(this.buildChapterItem(node));
        break;
    }
    return items;
  }
}
