import { Injectable } from '@angular/core';
import { EuiDialogService } from '@eui/components/eui-dialog';
import { EuiDropdownButtonMenuItem } from '@eui/components/eui-dropdown-button-menu';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import {
  ARTICLE_TYPE_CHANGE_ACTION_ID,
  ARTICLE_TYPE_DEFINITION,
  ARTICLE_TYPE_REGULAR,
} from '@/features/akn-document/constants/inline-toc-actions.constants';
import { TableOfContentService } from '@/features/akn-document/services/table-of-content.service';
import { TableOfContentEditService } from '@/features/akn-document/services/table-of-content-edit.service';
import { ValidateTocService } from '@/features/akn-document/services/validate-node-drop.service';
import { ARTICLE } from '@/shared/constants';
import { TableOfContentItemVO } from '@/shared/models/toc.model';
import { CoEditionServiceWS } from '@/shared/services/coEdition.websocket.service';
import { DocumentService } from '@/shared/services/document.service';

import { TocInlineEditMenuService } from './toc-inline-edit-menu.service';

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

  getItems(node: TableOfContentItemVO): EuiDropdownButtonMenuItem[] {
    let items: EuiDropdownButtonMenuItem[] = [];
    switch (node.tocItem.aknTag) {
      case ARTICLE:
        items = [
          {
            id: ARTICLE_TYPE_CHANGE_ACTION_ID,
            label: this.translateService.instant(
              'toc.edit.window.item.list.type.change',
            ),
            iconClass: null,
            children: [
              {
                id: ARTICLE_TYPE_REGULAR,
                label: this.translateService.instant(
                  'toc.edit.window.item.regular.article.type',
                ),
                iconClass: null,
                command: () => this.handleArticleTypeChange('REGULAR'),
              },
              {
                id: ARTICLE_TYPE_DEFINITION,
                label: this.translateService.instant(
                  'toc.edit.window.item.definition.article.type',
                ),
                iconClass: null,
                command: () => this.handleArticleTypeChange('DEFINITION'),
              },
            ],
          },
        ];
        break;
    }
    return items;
  }

  updateTypeSpecificItems(
    node: TableOfContentItemVO,
  ): EuiDropdownButtonMenuItem[] {
    const items: EuiDropdownButtonMenuItem[] = this.getItems(node);
    return items;
  }
}
