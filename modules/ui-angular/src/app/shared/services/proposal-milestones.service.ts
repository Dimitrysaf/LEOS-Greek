import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { parse as parseContentDisposition } from 'content-disposition-attachment';
import {BehaviorSubject, finalize, Observable} from 'rxjs';
import { apiBaseUrl } from 'src/config';

import type { MilestoneViewResponse } from '@/features/proposal-view/models/milestone.model';
import { LoadingService } from '@/shared/services/loading.service';
import { downloadBlob } from '@/shared/utils';

@Injectable({
  providedIn: 'root',
})
export class ProposalMilestonesService {
  readyToMergeStatus$: Observable<string>;
  requestStoredDocumentAnnotations$: Observable<string>;
  private requestStoredDocumentAnnotations = new BehaviorSubject<string>(null);
  triggerRequestStoredDocumentAnnotations$: Observable<{proposalRef, legFileName, documentRef}>;
  private triggerRequestStoredDocumentAnnotationsBS = new BehaviorSubject<{proposalRef, legFileName, documentRef}>(null);
  receiveStoredDocumentAnnotations$: Observable<string>;
  private receiveStoredDocumentAnnotations = new BehaviorSubject<string>(null);
  private readyToMergeStatusSource = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.readyToMergeStatus$ = this.readyToMergeStatusSource.asObservable();
    this.requestStoredDocumentAnnotations$ = this.requestStoredDocumentAnnotations.asObservable();
    this.receiveStoredDocumentAnnotations$ = this.receiveStoredDocumentAnnotations.asObservable();
    this.triggerRequestStoredDocumentAnnotations$ = this.triggerRequestStoredDocumentAnnotationsBS.asObservable();
  }

  listMilestoneView(proposalRef: string, legFileName: string) {
    return this.http.get<MilestoneViewResponse>(
      `${apiBaseUrl}/secured/list-milestones-view/${proposalRef}`,
      {
        params: { legFileName },
      },
    );
  }

  listMilestoneViewFromVersion(
    proposalRef: string,
    versionedReference: string,
  ) {
    return this.http.get<MilestoneViewResponse>(
      `${apiBaseUrl}/secured/list-milestones-view-version/${proposalRef}`,
      {
        params: { versionedReference },
      },
    );
  }

  listContributionsView(proposalRef: string, legFileName: string) {
    return this.http.get<MilestoneViewResponse>(
      `${apiBaseUrl}/secured/contribution/milestones/${proposalRef}/viewContribution/${legFileName}`,
    );
  }

  getStoredDocumentAnnotations(uri: string) {
    this.requestStoredDocumentAnnotations.next(uri);
  }

  triggerRequestStoredDocumentAnnotations(proposalRef: string, legFileName: string, documentRef: string) {
    this.triggerRequestStoredDocumentAnnotationsBS.next({proposalRef: proposalRef, legFileName: legFileName, documentRef: documentRef});
  }

  sendRequestStoredDocumentAnnotations(proposalRef: string, legFileName: string, documentRef: string, removeRevisionPrefix: boolean) {
    return this.http
      .get<string>(
        `${apiBaseUrl}/secured/document/${legFileName}/${proposalRef}/stored-annotations/${documentRef}?removeRevisionPrefix=${removeRevisionPrefix}`
      ).subscribe((response) => {
        this.receiveStoredDocumentAnnotations.next(response);
      });
  }

  sendEmptyStoredDocumentAnnotations() {
    this.receiveStoredDocumentAnnotations.next(null);
  }

  exportMilestonePdf(documentRef: string, legFileName: string) {
    this.loadingService.setLoading(true);
    return this.http
      .get(
        `${apiBaseUrl}/secured/list-milestones-view/pdf-export/${documentRef}`,
        {
          params: { legFileName },
          observe: 'response',
          responseType: 'blob',
        },
      )
      .subscribe({
        next: (response) => {
          const cd = parseContentDisposition(
            response.headers.get('Content-Disposition'),
          );
          const filename = cd.attachment
            ? cd.filename
            : `Proposal_${documentRef}.pdf`;
          downloadBlob(response.body, filename, this.document);
        },
        complete: () => this.loadingService.setLoading(false),
      });
  }

  exportMilestonePdfFromVersion(
    documentRef: string,
    versionedReference: string,
  ) {
    this.loadingService.setLoading(true);
    return this.http
      .get(
        `${apiBaseUrl}/secured/list-milestones-view-version/pdf-export/${documentRef}`,
        {
          params: { versionedReference },
          observe: 'response',
          responseType: 'blob',
        },
      )
      .subscribe({
        next: (response) => {
          const cd = parseContentDisposition(
            response.headers.get('Content-Disposition'),
          );
          const filename = cd.attachment
            ? cd.filename
            : `Proposal_${documentRef}.pdf`;
          downloadBlob(response.body, filename, this.document);
        },
        complete: () => this.loadingService.setLoading(false),
      });
  }

  downloadLegFile(legFileId: string) {
    this.loadingService.setLoading(true);
    return this.http
      .get(`${apiBaseUrl}/secured/searchlegfile/${legFileId}`, {
        observe: 'response',
        responseType: 'blob',
      })
      .subscribe({
        next: (response) => {
          const cd = parseContentDisposition(
            response.headers.get('Content-Disposition'),
          );
          const filename = cd.attachment
            ? cd.filename
            : `Proposal_${legFileId}.leg`;
          downloadBlob(response.body, filename, this.document);
        },
        complete: () => this.loadingService.setLoading(false),
      });
  }

  downloadLegFileAnyStatus(legFileId: string) {
    this.loadingService.setLoading(true);
    return this.http
      .get(`${apiBaseUrl}/secured/searchlegfile/anystatus/${legFileId}`, {
        observe: 'response',
        responseType: 'blob',
      })
      .subscribe({
        next: (response) => {
          const cd = parseContentDisposition(
            response.headers.get('Content-Disposition'),
          );
          const filename = cd.attachment
            ? cd.filename
            : `Proposal_${legFileId}.leg`;
          downloadBlob(response.body, filename, this.document);
        },
        complete: () => this.loadingService.setLoading(false),
      });
  }

  updateReadyToMergeStatus(status: string): void {
    this.readyToMergeStatusSource.next(status);
  }

  resetReadyToMergeStatus(): void {
    this.readyToMergeStatusSource.next('');
  }
}
