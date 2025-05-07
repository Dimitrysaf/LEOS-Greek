import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  NodeValidation,
} from '@/shared/models/drop-response.model';
import { TableOfContentItemVO } from '@/shared/models/toc.model';
import { DocumentService } from '@/shared/services/document.service';

import { ValidateTocService } from './validate-node-drop.service';
import {TableOfContentService} from "@/features/akn-document/services/table-of-content.service";

@Injectable()
export class ValidateTocProposalService extends ValidateTocService {
  constructor(
    protected _http: HttpClient,
    protected documentService: DocumentService,
    protected tocService: TableOfContentService,
  ) {
    super(_http, documentService, tocService);
  }

  validateAddingToItem(
    validationResult: NodeValidation,
    sourceItem: TableOfContentItemVO,
    targetItem: TableOfContentItemVO,
    tocTree: TableOfContentItemVO[],
    actualTargetItem: TableOfContentItemVO,
    position: string,
  ) {
    return true;
  }
}
