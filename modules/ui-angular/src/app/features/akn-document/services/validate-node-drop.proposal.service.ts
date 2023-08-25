import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  NodeValidation,
  NodeValidationResponse,
} from '@/shared/models/drop-response.model';
import { TableOfContentItemVO } from '@/shared/models/toc.model';

import { ValidateTocService } from './validate-node-drop.service';

@Injectable()
export class ValidateTocProposalService extends ValidateTocService {
  constructor(private _http: HttpClient) {
    super(_http);
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
