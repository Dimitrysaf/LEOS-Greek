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
      `${apiBaseUrl}/secured/annotation/requestUserPermissions/${this.documentTypeEnum}/${this.documentRef}`,
    );
  }

  getDocumentsMetadata() {
    return this.httpClient.get<AnnotateMetadata>(
      `${apiBaseUrl}/secured/annotation/requestDocumentMetadata/${this.documentTypeEnum}/${this.documentRef}`,
    );
  }

  requestMergeSuggestion(mergeRequest: MergeSuggestionRequest) {
    return this.httpClient
      .post(
        `${apiBaseUrl}/secured/annotation/requestMergeSuggestion/${this.documentTypeEnum}/${this.documentRef}`,
        mergeRequest,
      )
      .pipe(finalize(() => this.reloadDocument()));
  }

  requestMergeSuggestions(mergeRequests: MergeSuggestionRequest[]) {
    return this.httpClient
      .post<MergeSuggestionResponse[]>(
        `${apiBaseUrl}/secured/annotation/requestMergeSuggestions/${this.documentTypeEnum}/${this.documentRef}`,
        { mergeSuggestionRequests: mergeRequests },
      )
      .pipe(finalize(() => this.reloadDocument()));
  }

  fetchSearchMetada() {
    return this.httpClient.get<AnnotateMetadata[]>(
      `${apiBaseUrl}/secured/annotation/requestSearchMetadata`,
    );
  }

  private reloadDocument() {
    this.documentService.setDocumentRefAndCategory(
      this.documentService.documentRef,
      this.documentService.documentType,
    );
  }

  private get documentTypeEnum() {
    return this.documentService.documentType.toUpperCase();
  }

  private get documentRef() {
    return this.documentService.documentRef;
  }
}
