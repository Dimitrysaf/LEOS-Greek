import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiBaseUrl } from 'src/config';

import { AnnotateMetadata, Permission } from '../models';
import { DocumentService } from './document.service';

@Injectable({ providedIn: 'root' })
export class AnnotateService {
  constructor(
    private httpClient: HttpClient,
    private documentService: DocumentService,
  ) {}

  getSecurityAnnotateToken() {
    return this.httpClient.get(
      `${apiBaseUrl}/secured/annotation/requestSecurityToken`,
      { responseType: 'text' },
    );
  }
  getUserPermissions() {
    return this.httpClient.get<Permission[]>(
      `${apiBaseUrl}/secured/annotation/requestUserPermissions/${this.documentType}/${this.documentRef}`,
    );
  }

  getDocumentsMetadata() {
    return this.httpClient.get<AnnotateMetadata>(
      `${apiBaseUrl}/secured/annotation/requestDocumentMetadata/${this.documentType}/${this.documentRef}`,
    );
  }

  get documentType() {
    return (this.documentService.documentType as string).toUpperCase();
  }

  get documentRef() {
    return this.documentService.documentRef;
  }
}
