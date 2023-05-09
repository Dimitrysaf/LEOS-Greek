import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { apiBaseUrl } from 'src/config';

import {
  AnnotateMetadata,
  MergeSuggestionRequest,
  MergeSuggestionResponse,
  Permission,
} from '../models';
import { DocumentService } from './document.service';

@Injectable()
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

  requestMergeSuggestion(mergeRequest: MergeSuggestionRequest) {
    return this.httpClient
      .post(
        `${apiBaseUrl}/secured/annotation/requestMergeSuggestion/${this.documentType}/${this.documentRef}`,
        mergeRequest,
      )
      .pipe(
        finalize(() =>
          this.documentService.setDocumentRefAndCategory(
            this.documentRef,
            this.documentType,
          ),
        ),
      );
  }

  requestMergeSuggestions(mergeRequests: MergeSuggestionRequest[]) {
    return this.httpClient
      .post<MergeSuggestionResponse[]>(
        `${apiBaseUrl}/secured/annotation/requestMergeSuggestions/${this.documentType}/${this.documentRef}`,
        { mergeSuggestionRequests: mergeRequests },
      )
      .pipe(
        finalize(() =>
          this.documentService.setDocumentRefAndCategory(
            this.documentRef,
            this.documentType,
          ),
        ),
      );
  }

  fetchSearchMetada() {
    return this.httpClient.get<AnnotateMetadata[]>(
      `${apiBaseUrl}/secured/annotation/requestSearchMetadata`,
    );
  }

  get documentType() {
    return (this.documentService.documentType as string).toUpperCase();
  }

  get documentRef() {
    return this.documentService.documentRef;
  }
}
