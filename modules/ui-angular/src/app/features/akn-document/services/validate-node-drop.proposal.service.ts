import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  NodeValidation,
  NodeValidationResponse,
} from '@/shared/models/drop-response.model';
import { TableOfContentItemVO } from '@/shared/models/toc.model';
import { DocumentService } from '@/shared/services/document.service';

import { ValidateTocService } from './validate-node-drop.service';

@Injectable()
export class ValidateTocProposalService extends ValidateTocService {
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
    return true;
  }
}
